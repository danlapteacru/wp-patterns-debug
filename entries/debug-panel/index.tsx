import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import DebugSections from './debug-sections';

interface DebugPanelProps {
	clientId: string;
}

/**
 * The Debug panel in the block inspector for the selected block.
 * @param root0
 * @param root0.clientId
 */
export default function DebugPanel( { clientId }: DebugPanelProps ) {
	const [ open, setOpen ] = useState( false );
	const block = useSelect(
		( select ) =>
			( select( 'core/block-editor' ) as any ).getBlock( clientId ),
		[ clientId ]
	);

	if ( ! block ) {
		return null;
	}

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Debug', 'wp-patterns-debug' ) }
				opened={ open }
				onToggle={ () => setOpen( ! open ) }
				className="wppd-panel"
			>
				{ open && <DebugSections block={ block } /> }
			</PanelBody>
		</InspectorControls>
	);
}
