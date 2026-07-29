import type { EditorPattern, ParsedBlockLike, PatternFilters } from '../types';

const UNKNOWN_SOURCE = 'unknown';

export function filterPatterns(
	patterns: EditorPattern[],
	{ search, source, category }: PatternFilters
): EditorPattern[] {
	const needle = search.trim().toLowerCase();

	return patterns.filter( ( pattern ) => {
		if ( source && ( pattern.source ?? UNKNOWN_SOURCE ) !== source ) {
			return false;
		}

		if ( category && ! ( pattern.categories ?? [] ).includes( category ) ) {
			return false;
		}

		if ( needle ) {
			const haystack = `${ pattern.title } ${ pattern.name } ${
				pattern.description ?? ''
			}`.toLowerCase();

			if ( ! haystack.includes( needle ) ) {
				return false;
			}
		}

		return true;
	} );
}

export function uniqueSources( patterns: EditorPattern[] ): string[] {
	return [
		...new Set(
			patterns.map( ( pattern ) => pattern.source ?? UNKNOWN_SOURCE )
		),
	].sort();
}

export function uniqueCategories( patterns: EditorPattern[] ): string[] {
	return [
		...new Set(
			patterns.flatMap( ( pattern ) => pattern.categories ?? [] )
		),
	].sort();
}

/**
 * Count block usage (including nested blocks) by block name.
 * @param blocks
 */
export function countBlocks(
	blocks: ParsedBlockLike[]
): Record< string, number > {
	const counts: Record< string, number > = {};

	const walk = ( list: ParsedBlockLike[] ): void => {
		for ( const block of list ) {
			counts[ block.name ] = ( counts[ block.name ] ?? 0 ) + 1;

			if ( block.innerBlocks?.length ) {
				walk( block.innerBlocks );
			}
		}
	};

	walk( blocks );

	return counts;
}

/** The subset of a `wp_block` REST record the browser needs. */
export interface UserPatternRecord {
	id: number;
	title?: { raw?: string };
	content?: { raw?: string };
	wp_pattern_sync_status?: string;
}

/**
 * Present a user pattern (wp_block post) as an EditorPattern. Core stores
 * these separately from the registered-pattern registry; an empty
 * `wp_pattern_sync_status` means the pattern is fully synced.
 * @param record
 */
export function userPatternToEditorPattern(
	record: UserPatternRecord
): EditorPattern {
	return {
		id: record.id,
		name: `core/block/${ record.id }`,
		title: record.title?.raw || `#${ record.id }`,
		content: record.content?.raw ?? '',
		source: 'user',
		syncStatus: record.wp_pattern_sync_status || 'fully',
	};
}
