import { serialize, store as blocksStore } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import CopyButton from '../components/copy-button';
import DumpButton from '../components/dump-button';
import type { EditorBlock } from '../types';
import { elementAttributes, findBlockElement } from '../utils/block-element';
import AttributesEditor from './attributes-editor';
import PatternProvenance from './pattern-provenance';

interface DebugSectionsProps {
	block: EditorBlock;
}

/**
 * The debug sections for one block. Host-agnostic: rendered both from the
 * block inspector and from the plugin sidebar (where it also covers synced
 * pattern instances, whose inspector hides all panels).
 * @param root0
 * @param root0.block
 */
export default function DebugSections( { block }: DebugSectionsProps ) {
	const { name, clientId, attributes } = block;
	const blockType = useSelect(
		( select ) => ( select( blocksStore ) as any ).getBlockType( name ),
		[ name ]
	);
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' ) as any;
	// Only mounted while a debug panel is open, so this stays lazy.
	const serialized = useMemo( () => serialize( block as any ), [ block ] );

	return (
		<>
			<section>
				<h3>{ __( 'Overview', 'wp-patterns-debug' ) }</h3>
				<pre className="wppd-markup">
					{ JSON.stringify( { name, clientId }, null, 2 ) }
				</pre>
				<ul className="wppd-actions">
					<li>
						<CopyButton
							text={ name }
							label={ __(
								'Copy block name',
								'wp-patterns-debug'
							) }
						/>
					</li>
					<li>
						<CopyButton
							text={ clientId }
							label={ __(
								'Copy client ID',
								'wp-patterns-debug'
							) }
						/>
					</li>
				</ul>
			</section>

			<section>
				<h3>{ __( 'Inspect', 'wp-patterns-debug' ) }</h3>
				<ul className="wppd-actions">
					<li>
						<DumpButton
							label={ __(
								'Dump block instance',
								'wp-patterns-debug'
							) }
							title={ __(
								'Block instance',
								'wp-patterns-debug'
							) }
							getValue={ () => block }
						/>
					</li>
					<li>
						<DumpButton
							label={ __(
								'Dump block type',
								'wp-patterns-debug'
							) }
							title={ __( 'Block type', 'wp-patterns-debug' ) }
							getValue={ () => blockType }
						/>
					</li>
					<li>
						<DumpButton
							label={ __(
								'Dump wrapper element attributes',
								'wp-patterns-debug'
							) }
							title={ __(
								'Wrapper element attributes',
								'wp-patterns-debug'
							) }
							getValue={ () => {
								const element = findBlockElement( clientId );

								return element
									? elementAttributes( element )
									: __(
											'Block wrapper element not found.',
											'wp-patterns-debug'
									  );
							} }
						/>
					</li>
				</ul>
			</section>

			<section>
				<h3>{ __( 'Block HTML', 'wp-patterns-debug' ) }</h3>
				<pre className="wppd-markup">{ serialized }</pre>
				<ul className="wppd-actions">
					<li>
						<CopyButton
							text={ serialized }
							label={ __(
								'Copy block HTML',
								'wp-patterns-debug'
							) }
						/>
					</li>
					<li>
						<DumpButton
							label={ __(
								'Dump block HTML',
								'wp-patterns-debug'
							) }
							title={ __( 'Block HTML', 'wp-patterns-debug' ) }
							getValue={ () => serialized }
						/>
					</li>
				</ul>
			</section>

			<AttributesEditor
				attributes={ attributes }
				schema={ blockType?.attributes ?? {} }
				onApply={ ( next ) => updateBlockAttributes( clientId, next ) }
			/>

			<PatternProvenance block={ block } />
		</>
	);
}
