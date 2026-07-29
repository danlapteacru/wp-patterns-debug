import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Button, ToggleControl } from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { chevronDown, chevronUp } from '@wordpress/icons';

import CopyButton from '../components/copy-button';
import DumpButton from '../components/dump-button';
import type { EditorPattern } from '../types';
import { countBlocks } from '../utils/patterns';
import type { ServerPattern } from './use-server-registry';

interface PatternItemProps {
	pattern: EditorPattern;
	/** The raw server-side registration for this pattern, if one exists. */
	serverPattern?: ServerPattern;
}

/**
 * Facts about the pattern worth showing at a glance.
 * @param pattern
 * @param serverSource Source from the server registration; the client
 *                     stores omit `source` for some registered patterns.
 */
function metaEntries(
	pattern: EditorPattern,
	serverSource?: string
): [ string, string ][] {
	const entries: [ string, string ][] = [
		[ __( 'Name', 'wp-patterns-debug' ), pattern.name ],
		[
			__( 'Source', 'wp-patterns-debug' ),
			pattern.source ??
				serverSource ??
				__( 'unknown', 'wp-patterns-debug' ),
		],
	];

	if ( pattern.categories?.length ) {
		entries.push( [
			__( 'Categories', 'wp-patterns-debug' ),
			pattern.categories.join( ', ' ),
		] );
	}

	if ( pattern.blockTypes?.length ) {
		entries.push( [
			__( 'Block types', 'wp-patterns-debug' ),
			pattern.blockTypes.join( ', ' ),
		] );
	}

	if ( pattern.postTypes?.length ) {
		entries.push( [
			__( 'Post types', 'wp-patterns-debug' ),
			pattern.postTypes.join( ', ' ),
		] );
	}

	if ( pattern.syncStatus ) {
		entries.push( [
			__( 'Sync status', 'wp-patterns-debug' ),
			pattern.syncStatus,
		] );
	}

	if ( pattern.inserter === false ) {
		entries.push( [
			__( 'Inserter', 'wp-patterns-debug' ),
			__( 'hidden', 'wp-patterns-debug' ),
		] );
	}

	return entries;
}

/**
 * Rendered only while the item is expanded, so parsing stays lazy.
 * @param root0
 * @param root0.pattern
 * @param root0.serverPattern
 */
function PatternDetails( { pattern, serverPattern }: PatternItemProps ) {
	const [ showPreview, setShowPreview ] = useState( false );
	const blocks = useMemo(
		() => parse( pattern.content ),
		[ pattern.content ]
	);
	const blockCounts = useMemo( () => countBlocks( blocks ), [ blocks ] );

	return (
		<div className="wppd-item__details">
			<dl className="wppd-item__meta">
				{ metaEntries(
					pattern,
					serverPattern?.source as string | undefined
				).map( ( [ label, value ] ) => (
					<div key={ label }>
						<dt>{ label }</dt>
						<dd>{ value }</dd>
					</div>
				) ) }
				<div>
					<dt>{ __( 'Blocks', 'wp-patterns-debug' ) }</dt>
					<dd>
						{ Object.entries( blockCounts )
							.map(
								( [ blockName, count ] ) =>
									`${ blockName } ×${ count }`
							)
							.join( ', ' ) || __( 'none', 'wp-patterns-debug' ) }
					</dd>
				</div>
			</dl>

			<ul className="wppd-actions">
				<li>
					<CopyButton
						text={ pattern.name }
						label={ __( 'Copy name', 'wp-patterns-debug' ) }
					/>
				</li>
				<li>
					<CopyButton
						text={ pattern.content }
						label={ __( 'Copy content', 'wp-patterns-debug' ) }
					/>
				</li>
				<li>
					<DumpButton
						label={ __( 'Dump pattern', 'wp-patterns-debug' ) }
						title={ pattern.name }
						getValue={ () => pattern }
					/>
				</li>
				{ serverPattern && (
					<li>
						<DumpButton
							label={ __(
								'Dump server registration',
								'wp-patterns-debug'
							) }
							title={ sprintf(
								/* translators: %s: pattern name. */
								__(
									'Server registration: %s',
									'wp-patterns-debug'
								),
								pattern.name
							) }
							getValue={ () => serverPattern }
						/>
					</li>
				) }
			</ul>

			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Preview', 'wp-patterns-debug' ) }
				checked={ showPreview }
				onChange={ setShowPreview }
			/>

			{ showPreview && (
				<div className="wppd-item__preview">
					<BlockPreview
						blocks={ blocks }
						viewportWidth={ pattern.viewportWidth ?? 1200 }
					/>
				</div>
			) }
		</div>
	);
}

export default function PatternItem( props: PatternItemProps ) {
	const { pattern } = props;
	const [ expanded, setExpanded ] = useState( false );

	return (
		<div className="wppd-item">
			<Button
				className="wppd-item__toggle"
				icon={ expanded ? chevronUp : chevronDown }
				onClick={ () => setExpanded( ! expanded ) }
				aria-expanded={ expanded }
			>
				{ pattern.title }
			</Button>

			{ expanded && <PatternDetails { ...props } /> }
		</div>
	);
}
