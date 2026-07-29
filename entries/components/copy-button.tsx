import { Button } from '@wordpress/components';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

interface CopyButtonProps {
	/** The text to copy, or a function producing it at click time. */
	text: string | ( () => string );
	label: string;
}

export default function CopyButton( { text, label }: CopyButtonProps ) {
	const { createNotice } = useDispatch( noticesStore );
	const ref = useCopyToClipboard< HTMLButtonElement >( text, () => {
		void createNotice(
			'info',
			__( 'Copied to clipboard.', 'wp-patterns-debug' ),
			{
				isDismissible: true,
				type: 'snackbar',
			}
		);
	} );

	return (
		<Button variant="link" ref={ ref }>
			{ label }
		</Button>
	);
}
