import dump from './dump';

describe( 'dump', () => {
	it( 'pretty-prints plain objects', () => {
		expect( dump( { a: 1 } ) ).toBe( '{\n  "a": 1\n}' );
	} );

	it( 'returns top-level strings raw', () => {
		expect( dump( '<!-- wp:paragraph -->' ) ).toBe(
			'<!-- wp:paragraph -->'
		);
	} );

	it( 'labels functions, keeping their name', () => {
		function myEdit() {}

		expect( dump( { edit: myEdit, anon: () => {} } ) ).toContain(
			'[Function: myEdit]'
		);
	} );

	it( 'labels React elements', () => {
		const element = {
			$$typeof: Symbol.for( 'react.element' ),
			type: 'div',
		};

		expect( dump( { icon: element } ) ).toContain( '[React element]' );
	} );

	it( 'replaces circular references without breaking repeated siblings', () => {
		const shared = { id: 1 };
		const circular: Record< string, unknown > = { shared, again: shared };
		circular.self = circular;

		const result = JSON.parse( dump( circular ) );

		expect( result.self ).toBe( '[Circular]' );
		expect( result.shared ).toEqual( { id: 1 } );
		expect( result.again ).toEqual( { id: 1 } );
	} );

	it( 'stringifies bigints and undefined', () => {
		expect( dump( { big: BigInt( 9 ) } ) ).toContain( '"9"' );
		expect( dump( undefined ) ).toBe( 'undefined' );
	} );

	it( 'serializes RichTextData-like values as their HTML string', () => {
		const richText = {
			toHTMLString: () => '<strong>Hi</strong>',
			toString: () => '<strong>Hi</strong>',
		};

		expect( JSON.parse( dump( { content: richText } ) ) ).toEqual( {
			content: '<strong>Hi</strong>',
		} );
	} );
} );
