/**
 * Find a block's wrapper element in the editor canvas, whether the canvas is
 * rendered inline or inside the editor iframe.
 *
 * @param clientId The block's client ID.
 */
export function findBlockElement( clientId: string ): Element | null {
	const documents = [
		document,
		...Array.from(
			document.querySelectorAll< HTMLIFrameElement >(
				'iframe[name="editor-canvas"]'
			)
		).map( ( frame ) => frame.contentDocument ),
	];

	for ( const doc of documents ) {
		const element = doc?.getElementById( `block-${ clientId }` );

		if ( element ) {
			return element;
		}
	}

	return null;
}

/**
 * The element's rendered attributes, as a plain object for dumping.
 *
 * @param element The element to read.
 */
export function elementAttributes(
	element: Element
): Record< string, string > {
	return Object.fromEntries(
		Array.from( element.attributes ).map( ( attribute ) => [
			attribute.name,
			attribute.value,
		] )
	);
}
