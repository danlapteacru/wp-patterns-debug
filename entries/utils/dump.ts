/**
 * Convert an arbitrary value (block instances, block types, store objects)
 * into readable JSON. Handles the values JSON.stringify chokes on or hides:
 * functions, React elements, circular references, and bigints.
 */

function sanitize( value: unknown, ancestors: readonly object[] ): unknown {
	if ( typeof value === 'function' ) {
		return value.name ? `[Function: ${ value.name }]` : '[Function]';
	}

	if ( typeof value === 'bigint' ) {
		return value.toString();
	}

	if ( typeof value !== 'object' || value === null ) {
		return value;
	}

	if ( ( value as { $$typeof?: symbol } ).$$typeof ) {
		return '[React element]';
	}

	if ( ancestors.includes( value ) ) {
		return '[Circular]';
	}

	const next = [ ...ancestors, value ];

	if ( Array.isArray( value ) ) {
		return value.map( ( item ) => sanitize( item, next ) );
	}

	return Object.fromEntries(
		Object.entries( value ).map( ( [ key, item ] ) => [
			key,
			sanitize( item, next ),
		] )
	);
}

export default function dump( value: unknown ): string {
	// Top-level strings (serialized HTML, pattern content) read better raw
	// than JSON-escaped.
	if ( typeof value === 'string' ) {
		return value;
	}

	const sanitized = sanitize( value, [] );

	return sanitized === undefined
		? 'undefined'
		: JSON.stringify( sanitized, null, 2 );
}
