import { elementAttributes, findBlockElement } from './block-element';

describe( 'findBlockElement', () => {
	afterEach( () => {
		document.body.innerHTML = '';
	} );

	it( 'finds the wrapper by client id in the top document', () => {
		document.body.innerHTML = '<div id="block-abc-123"></div>';

		expect( findBlockElement( 'abc-123' ) ).not.toBeNull();
	} );

	it( 'returns null when the block is not rendered', () => {
		expect( findBlockElement( 'missing' ) ).toBeNull();
	} );
} );

describe( 'elementAttributes', () => {
	it( 'maps rendered attributes to a plain object', () => {
		const element = document.createElement( 'div' );
		element.setAttribute( 'id', 'block-1' );
		element.setAttribute( 'class', 'wp-block' );
		element.setAttribute( 'data-type', 'core/paragraph' );

		expect( elementAttributes( element ) ).toEqual( {
			id: 'block-1',
			class: 'wp-block',
			'data-type': 'core/paragraph',
		} );
	} );
} );
