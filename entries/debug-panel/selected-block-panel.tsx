import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import DebugSections from './debug-sections';

/**
 * Debug panel for the selected block, hosted in the plugin sidebar. This is
 * the only reachable debug surface for synced pattern instances: the block
 * inspector renders no panels at all for core/block selections.
 */
export default function SelectedBlockPanel() {
	const [ open, setOpen ] = useState( false );
	const block = useSelect(
		( select ) =>
			( select( 'core/block-editor' ) as any ).getSelectedBlock(),
		[]
	);

	return (
		<PanelBody
			title={ __( 'Selected block', 'wp-patterns-debug' ) }
			opened={ open }
			onToggle={ () => setOpen( ! open ) }
			className="wppd-panel"
		>
			{ open &&
				( block ? (
					<DebugSections block={ block } />
				) : (
					<p className="wppd-muted">
						{ __( 'No block selected.', 'wp-patterns-debug' ) }
					</p>
				) ) }
		</PanelBody>
	);
}
