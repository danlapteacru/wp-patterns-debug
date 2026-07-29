import { buildNextAttributes, validateAttributesJson } from './attributes';

const schema = { content: { type: 'string' }, level: { type: 'number' } };

describe( 'validateAttributesJson', () => {
	it( 'rejects invalid JSON with the parser message as detail', () => {
		const result = validateAttributesJson( '{nope}', schema );

		expect( result ).toMatchObject( {
			valid: false,
			error: 'invalid-json',
		} );
		expect(
			result.valid === false &&
				result.error === 'invalid-json' &&
				result.detail.length
		).toBeGreaterThan( 0 );
	} );

	it( 'rejects non-object JSON', () => {
		for ( const json of [ '[1,2]', '"text"', '3', 'null' ] ) {
			expect( validateAttributesJson( json, schema ) ).toEqual( {
				valid: false,
				error: 'not-an-object',
			} );
		}
	} );

	it( 'accepts an object and reports keys missing from the schema', () => {
		const result = validateAttributesJson(
			'{"content":"hi","custom":1}',
			schema
		);

		expect( result ).toEqual( {
			valid: true,
			parsed: { content: 'hi', custom: 1 },
			unknownKeys: [ 'custom' ],
		} );
	} );
} );

describe( 'buildNextAttributes', () => {
	it( 'clears keys deleted from the draft so setAttributes removes them', () => {
		expect( buildNextAttributes( { a: 1, b: 2 }, { a: 3 } ) ).toEqual( {
			a: 3,
			b: undefined,
		} );
	} );
} );
