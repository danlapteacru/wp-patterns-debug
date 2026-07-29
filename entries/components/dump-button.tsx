import type { ReactNode } from 'react';
import { Button, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import dump from '../utils/dump';
import CopyButton from './copy-button';

interface DumpButtonProps {
	label: ReactNode;
	/** Modal title. */
	title: string;
	/** Called at click time so dumping stays lazy. */
	getValue: () => unknown;
}

/**
 * A link-style button that opens a modal with a pretty-printed dump of the
 * value, plus a copy action. Each button owns its modal.
 * @param root0
 * @param root0.label
 * @param root0.title
 * @param root0.getValue
 */
export default function DumpButton( {
	label,
	title,
	getValue,
}: DumpButtonProps ) {
	const [ content, setContent ] = useState< string | null >( null );

	return (
		<>
			<Button
				variant="link"
				onClick={ () => setContent( dump( getValue() ) ) }
			>
				{ label }
			</Button>

			{ content !== null && (
				<Modal
					title={ title }
					className="wppd-modal"
					onRequestClose={ () => setContent( null ) }
				>
					<pre className="wppd-markup">{ content }</pre>
					<CopyButton
						text={ content }
						label={ __( 'Copy to clipboard', 'wp-patterns-debug' ) }
					/>
				</Modal>
			) }
		</>
	);
}
