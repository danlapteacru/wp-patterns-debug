/**
 * A pattern as seen by the editor's client stores, or synthesized from a
 * `wp_block` post (user pattern).
 */
export interface EditorPattern {
	name: string;
	title: string;
	content: string;
	description?: string;
	categories?: string[];
	blockTypes?: string[];
	postTypes?: string[];
	templateTypes?: string[];
	source?: string;
	syncStatus?: string;
	inserter?: boolean;
	viewportWidth?: number;
	/** Present for user patterns (wp_block posts). */
	id?: number;
	[ key: string ]: unknown;
}

export interface PatternFilters {
	search: string;
	/** Empty string means "all sources". */
	source: string;
	/** Empty string means "all categories". */
	category: string;
}

/** The minimal shape of a parsed block we need for summaries. */
export interface ParsedBlockLike {
	name: string;
	innerBlocks?: ParsedBlockLike[];
}

/** The minimal shape of a block-editor block instance we work with. */
export interface EditorBlock {
	name: string;
	clientId: string;
	attributes: Record< string, any >;
	innerBlocks?: EditorBlock[];
}

export interface DebugPanelProps {
	name: string;
	clientId: string;
	isSelected: boolean;
	attributes: Record< string, unknown >;
	setAttributes: ( attributes: Record< string, unknown > ) => void;
}
