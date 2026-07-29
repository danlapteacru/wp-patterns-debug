import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import DumpButton from '../components/dump-button';
import type { EditorPattern } from '../types';

interface ProvenanceBlock {
	name: string;
	attributes: {
		ref?: number;
		content?: Record< string, unknown >;
		metadata?: { patternName?: string };
		[ key: string ]: unknown;
	};
}

interface PatternProvenanceProps {
	block: ProvenanceBlock;
}

/**
 * Surfaces the two ways a block can still be linked to a pattern: being a
 * synced pattern instance (core/block with a `ref`), or carrying the
 * `metadata.patternName` breadcrumb left by pattern insertion.
 * @param root0
 * @param root0.block
 */
export default function PatternProvenance( { block }: PatternProvenanceProps ) {
	const ref = block.name === 'core/block' ? block.attributes.ref : undefined;
	const patternName = block.attributes.metadata?.patternName;

	const syncedRecord = useSelect(
		( select ) =>
			ref
				? ( select( coreStore ) as any ).getEntityRecord(
						'postType',
						'wp_block',
						ref
				  )
				: null,
		[ ref ]
	);
	const registryPattern = useSelect(
		( select ) => {
			if ( ! patternName ) {
				return null;
			}

			const patterns: EditorPattern[] =
				( select( coreStore ) as any ).getBlockPatterns() ?? [];

			return (
				patterns.find( ( pattern ) => pattern.name === patternName ) ??
				null
			);
		},
		[ patternName ]
	);

	return (
		<section>
			<h3>{ __( 'Pattern provenance', 'wp-patterns-debug' ) }</h3>

			{ ! ref && ! patternName && (
				<p className="wppd-muted">
					{ __(
						'No pattern linkage detected on this block.',
						'wp-patterns-debug'
					) }
				</p>
			) }

			{ ref && (
				<>
					<p>
						{ __(
							'Synced pattern instance.',
							'wp-patterns-debug'
						) }{ ' ' }
						{ syncedRecord
							? `${ syncedRecord.title?.raw ?? '' } (#${ ref })`
							: `#${ ref }` }
					</p>
					<ul className="wppd-actions">
						<li>
							<DumpButton
								label={ __(
									'Dump wp_block record',
									'wp-patterns-debug'
								) }
								title={ __(
									'wp_block record',
									'wp-patterns-debug'
								) }
								getValue={ () => syncedRecord }
							/>
						</li>
						{ block.attributes.content && (
							<li>
								<DumpButton
									label={ __(
										'Dump instance overrides',
										'wp-patterns-debug'
									) }
									title={ __(
										'Pattern overrides',
										'wp-patterns-debug'
									) }
									getValue={ () => block.attributes.content }
								/>
							</li>
						) }
					</ul>
				</>
			) }

			{ patternName && (
				<>
					<p>
						{ __( 'Inserted from pattern:', 'wp-patterns-debug' ) }{ ' ' }
						<code>{ patternName }</code>
					</p>
					{ registryPattern ? (
						<ul className="wppd-actions">
							<li>
								<DumpButton
									label={ __(
										'Dump source pattern',
										'wp-patterns-debug'
									) }
									title={ patternName }
									getValue={ () => registryPattern }
								/>
							</li>
						</ul>
					) : (
						<p className="wppd-muted">
							{ __(
								'Not found in the client pattern registry.',
								'wp-patterns-debug'
							) }
						</p>
					) }
				</>
			) }
		</section>
	);
}
