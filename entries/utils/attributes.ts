export type AttributesValidation =
	| { valid: false; error: 'invalid-json'; detail: string }
	| { valid: false; error: 'not-an-object' }
	| { valid: true; parsed: Record< string, unknown >; unknownKeys: string[] };

/**
 * Validate a JSON string as a block attributes object, reporting keys that
 * are not part of the block type's attribute schema.
 * @param json
 * @param schema
 */
export function validateAttributesJson(
	json: string,
	schema: Record< string, unknown >
): AttributesValidation {
	let parsed: unknown;

	try {
		parsed = JSON.parse( json );
	} catch ( error ) {
		return {
			valid: false,
			error: 'invalid-json',
			detail: ( error as Error ).message,
		};
	}

	if (
		typeof parsed !== 'object' ||
		parsed === null ||
		Array.isArray( parsed )
	) {
		return { valid: false, error: 'not-an-object' };
	}

	const attributes = parsed as Record< string, unknown >;

	return {
		valid: true,
		parsed: attributes,
		unknownKeys: Object.keys( attributes ).filter(
			( key ) => ! ( key in schema )
		),
	};
}

/**
 * setAttributes() merges into the existing attributes, so keys the user
 * deleted from the JSON must be explicitly set to undefined to be removed.
 * @param current
 * @param next
 */
export function buildNextAttributes(
	current: Record< string, unknown >,
	next: Record< string, unknown >
): Record< string, unknown > {
	const cleared = Object.fromEntries(
		Object.keys( current ).map( ( key ) => [ key, undefined ] )
	);

	return { ...cleared, ...next };
}
