import { createHigherOrderComponent } from '@wordpress/compose';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { bug } from '@wordpress/icons';
import { registerPlugin } from '@wordpress/plugins';

import DebugPanel from './debug-panel';
import SelectedBlockPanel from './debug-panel/selected-block-panel';
import PatternBrowser from './pattern-browser';
import type { DebugPanelProps } from './types';
import './index.scss';

const SIDEBAR_NAME = 'wp-patterns-debug';

registerPlugin( SIDEBAR_NAME, {
	icon: bug,
	render: () => (
		<>
			<PluginSidebarMoreMenuItem target={ SIDEBAR_NAME }>
				{ __( 'Patterns Debug', 'patterns-debug' ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name={ SIDEBAR_NAME }
				title={ __( 'Patterns Debug', 'patterns-debug' ) }
				icon={ bug }
			>
				<SelectedBlockPanel />
				<PatternBrowser />
			</PluginSidebar>
		</>
	),
} );

addFilter(
	'editor.BlockEdit',
	'wp-patterns-debug/debug-panel',
	createHigherOrderComponent(
		( BlockEdit ) =>
			function BlockEditWithDebugPanel( props: DebugPanelProps ) {
				return (
					<>
						<BlockEdit { ...props } />
						{ /* Gate on selection so the panel's hooks and serialization cost
                nothing for the hundreds of unselected blocks. */ }
						{ props.isSelected ? (
							<DebugPanel { ...props } />
						) : null }
					</>
				);
			},
		'withDebugPanel'
	),
	100
);
