import {
	Notice,
	PanelBody,
	SearchControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';

import DumpButton from '../components/dump-button';
import type { EditorPattern, PatternFilters } from '../types';
import {
	filterPatterns,
	uniqueCategories,
	uniqueSources,
	userPatternToEditorPattern,
	type UserPatternRecord,
} from '../utils/patterns';
import PatternItem from './pattern-item';
import useServerRegistry from './use-server-registry';

const ALL_OPTION = { label: __( 'All', 'wp-patterns-debug' ), value: '' };

const USER_PATTERNS_QUERY = { per_page: -1 };

function toOptions( values: string[] ) {
	return [
		ALL_OPTION,
		...values.map( ( value ) => ( { label: value, value } ) ),
	];
}

export default function PatternBrowser() {
	const { registered, userRecords, resolved } = useSelect( ( select ) => {
		// getBlockPatterns and resolution selectors are not yet part of the
		// published core-data types.
		const core = select( coreStore ) as any;

		return {
			registered: core.getBlockPatterns() as EditorPattern[] | undefined,
			userRecords: core.getEntityRecords(
				'postType',
				'wp_block',
				USER_PATTERNS_QUERY
			) as UserPatternRecord[] | null,
			resolved: ( core.hasFinishedResolution( 'getBlockPatterns', [] ) &&
				core.hasFinishedResolution( 'getEntityRecords', [
					'postType',
					'wp_block',
					USER_PATTERNS_QUERY,
				] ) ) as boolean,
		};
	}, [] );
	const server = useServerRegistry();

	const patterns = useMemo(
		() => [
			...( registered ?? [] ),
			...( userRecords ?? [] ).map( userPatternToEditorPattern ),
		],
		[ registered, userRecords ]
	);

	const [ filters, setFilters ] = useState< PatternFilters >( {
		search: '',
		source: '',
		category: '',
	} );
	const filtered = useMemo(
		() => filterPatterns( patterns, filters ),
		[ patterns, filters ]
	);

	const serverByName = useMemo(
		() =>
			new Map(
				server.status === 'success'
					? server.registry.patterns.map( ( pattern ) => [
							pattern.name,
							pattern,
					  ] )
					: []
			),
		[ server ]
	);

	return (
		<>
			<PanelBody
				title={ __( 'Server registry', 'wp-patterns-debug' ) }
				initialOpen={ false }
			>
				{ server.status === 'loading' && <Spinner /> }

				{ server.status === 'error' && (
					<Notice status="warning" isDismissible={ false }>
						{ server.message ??
							__(
								'The registry request failed.',
								'wp-patterns-debug'
							) }
					</Notice>
				) }

				{ server.status === 'success' && (
					<>
						<p>
							{ sprintf(
								/* translators: 1: pattern count phrase, 2: category count phrase. */
								__(
									'%1$s and %2$s registered server-side.',
									'wp-patterns-debug'
								),
								sprintf(
									/* translators: %d: number of patterns. */
									_n(
										'%d pattern',
										'%d patterns',
										server.registry.patterns.length,
										'wp-patterns-debug'
									),
									server.registry.patterns.length
								),
								sprintf(
									/* translators: %d: number of categories. */
									_n(
										'%d category',
										'%d categories',
										server.registry.categories.length,
										'wp-patterns-debug'
									),
									server.registry.categories.length
								)
							) }
						</p>
						<ul className="wppd-actions">
							<li>
								<DumpButton
									label={ __(
										'Dump server patterns',
										'wp-patterns-debug'
									) }
									title={ __(
										'Server patterns',
										'wp-patterns-debug'
									) }
									getValue={ () => server.registry.patterns }
								/>
							</li>
							<li>
								<DumpButton
									label={ __(
										'Dump server categories',
										'wp-patterns-debug'
									) }
									title={ __(
										'Server categories',
										'wp-patterns-debug'
									) }
									getValue={ () =>
										server.registry.categories
									}
								/>
							</li>
						</ul>
					</>
				) }
			</PanelBody>

			<div className="wppd-browser">
				<div className="wppd-browser__filters">
					<SearchControl
						__nextHasNoMarginBottom
						label={ __( 'Search patterns', 'wp-patterns-debug' ) }
						value={ filters.search }
						onChange={ ( search ) =>
							setFilters( { ...filters, search } )
						}
					/>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Source', 'wp-patterns-debug' ) }
						value={ filters.source }
						options={ toOptions( uniqueSources( patterns ) ) }
						onChange={ ( source ) =>
							setFilters( { ...filters, source } )
						}
					/>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Category', 'wp-patterns-debug' ) }
						value={ filters.category }
						options={ toOptions( uniqueCategories( patterns ) ) }
						onChange={ ( category ) =>
							setFilters( { ...filters, category } )
						}
					/>
				</div>

				{ ! resolved ? (
					<Spinner />
				) : (
					<>
						<p className="wppd-browser__count">
							{ sprintf(
								/* translators: 1: shown pattern count, 2: total pattern count. */
								_n(
									'Showing %1$d of %2$d pattern.',
									'Showing %1$d of %2$d patterns.',
									patterns.length,
									'wp-patterns-debug'
								),
								filtered.length,
								patterns.length
							) }
						</p>

						{ filtered.map( ( pattern ) => (
							<PatternItem
								key={ pattern.name }
								pattern={ pattern }
								serverPattern={ serverByName.get(
									pattern.name
								) }
							/>
						) ) }
					</>
				) }
			</div>
		</>
	);
}
