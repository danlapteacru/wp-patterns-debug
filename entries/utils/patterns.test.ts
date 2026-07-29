import type { EditorPattern } from '../types';
import {
	countBlocks,
	filterPatterns,
	uniqueCategories,
	uniqueSources,
	userPatternToEditorPattern,
} from './patterns';

const patterns: EditorPattern[] = [
	{
		name: 'theme/hero',
		title: 'Hero',
		content: '',
		source: 'theme',
		categories: [ 'banner', 'featured' ],
		description: 'A big banner',
	},
	{
		name: 'core/query',
		title: 'Query loop',
		content: '',
		source: 'core',
		categories: [ 'posts' ],
	},
	{ name: 'mystery/one', title: 'Mystery', content: '' },
];

describe( 'filterPatterns', () => {
	it( 'matches search against title, name, and description', () => {
		expect(
			filterPatterns( patterns, {
				search: 'banner',
				source: '',
				category: '',
			} )
		).toHaveLength( 1 );
		expect(
			filterPatterns( patterns, {
				search: 'core/query',
				source: '',
				category: '',
			} )
		).toHaveLength( 1 );
		expect(
			filterPatterns( patterns, {
				search: 'HERO',
				source: '',
				category: '',
			} )
		).toHaveLength( 1 );
	} );

	it( 'filters by source, treating missing source as unknown', () => {
		expect(
			filterPatterns( patterns, {
				search: '',
				source: 'theme',
				category: '',
			} )
		).toHaveLength( 1 );
		expect(
			filterPatterns( patterns, {
				search: '',
				source: 'unknown',
				category: '',
			} )
		).toHaveLength( 1 );
	} );

	it( 'filters by category and combines filters', () => {
		expect(
			filterPatterns( patterns, {
				search: '',
				source: '',
				category: 'posts',
			} )
		).toHaveLength( 1 );
		expect(
			filterPatterns( patterns, {
				search: 'hero',
				source: 'core',
				category: '',
			} )
		).toHaveLength( 0 );
	} );
} );

describe( 'uniqueSources / uniqueCategories', () => {
	it( 'returns sorted unique values', () => {
		expect( uniqueSources( patterns ) ).toEqual( [
			'core',
			'theme',
			'unknown',
		] );
		expect( uniqueCategories( patterns ) ).toEqual( [
			'banner',
			'featured',
			'posts',
		] );
	} );
} );

describe( 'countBlocks', () => {
	it( 'counts nested blocks by name', () => {
		const blocks = [
			{
				name: 'core/group',
				innerBlocks: [
					{ name: 'core/paragraph' },
					{ name: 'core/paragraph' },
				],
			},
			{ name: 'core/paragraph' },
		];

		expect( countBlocks( blocks ) ).toEqual( {
			'core/group': 1,
			'core/paragraph': 3,
		} );
	} );
} );

describe( 'userPatternToEditorPattern', () => {
	it( 'maps a wp_block record, defaulting empty sync status to fully', () => {
		expect(
			userPatternToEditorPattern( {
				id: 7,
				title: { raw: 'My pattern' },
				content: { raw: '<!-- wp:paragraph /-->' },
				wp_pattern_sync_status: '',
			} )
		).toEqual( {
			id: 7,
			name: 'core/block/7',
			title: 'My pattern',
			content: '<!-- wp:paragraph /-->',
			source: 'user',
			syncStatus: 'fully',
		} );
	} );

	it( 'keeps an explicit unsynced status and falls back to the id as title', () => {
		const pattern = userPatternToEditorPattern( {
			id: 9,
			wp_pattern_sync_status: 'unsynced',
		} );

		expect( pattern.syncStatus ).toBe( 'unsynced' );
		expect( pattern.title ).toBe( '#9' );
		expect( pattern.content ).toBe( '' );
	} );
} );
