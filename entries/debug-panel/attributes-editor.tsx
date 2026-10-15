import { Button, Flex, Notice, TextareaControl } from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import dump from '../utils/dump';
import {
	buildNextAttributes,
	validateAttributesJson,
} from '../utils/attributes';

interface AttributesEditorProps {
	attributes: Record< string, unknown >;
	/** The block type's attribute schema, used to warn about unknown keys. */
	schema: Record< string, unknown >;
	/** Receives the merge-ready attributes object (deleted keys included as undefined). */
	onApply: ( attributes: Record< string, unknown > ) => void;
}

/**
 * Raw JSON editor for the selected block's attributes: edit, validate,
 * apply. Deleting a key from the JSON removes the attribute.
 * @param root0
 * @param root0.attributes
 * @param root0.schema
 * @param root0.onApply
 */
export default function AttributesEditor( {
	attributes,
	schema,
	onApply,
}: AttributesEditorProps ) {
	// null means "no local edits": the textarea mirrors the live attributes.
	const [ draft, setDraft ] = useState< string | null >( null );
	const liveJson = useMemo( () => dump( attributes ), [ attributes ] );
	const validation =
		draft === null ? null : validateAttributesJson( draft, schema );

	return (
		<section>
			<h3>{ __( 'Attributes', 'patterns-debug' ) }</h3>

			<TextareaControl
				__nextHasNoMarginBottom
				hideLabelFromVision
				label={ __( 'Attributes JSON', 'patterns-debug' ) }
				className="wppd-json-editor"
				rows={ 12 }
				value={ draft ?? liveJson }
				onChange={ setDraft }
			/>

			{ validation && ! validation.valid && (
				<Notice status="error" isDismissible={ false }>
					{ validation.error === 'invalid-json'
						? sprintf(
								/* translators: %s: JSON parser error message. */
								__( 'Invalid JSON: %s', 'patterns-debug' ),
								validation.detail
						  )
						: __(
								'Attributes must be a JSON object.',
								'patterns-debug'
						  ) }
				</Notice>
			) }

			{ validation?.valid && validation.unknownKeys.length > 0 && (
				<Notice status="warning" isDismissible={ false }>
					{ sprintf(
						/* translators: %s: comma-separated attribute names. */
						__(
							'Not in the attribute schema: %s',
							'patterns-debug'
						),
						validation.unknownKeys.join( ', ' )
					) }
				</Notice>
			) }

			<Flex justify="flex-start">
				<Button
					variant="primary"
					disabled={ ! validation?.valid }
					onClick={ () => {
						if ( validation?.valid ) {
							onApply(
								buildNextAttributes(
									attributes,
									validation.parsed
								)
							);
							setDraft( null );
						}
					} }
				>
					{ __( 'Apply', 'patterns-debug' ) }
				</Button>
				<Button
					variant="tertiary"
					disabled={ draft === null }
					onClick={ () => setDraft( null ) }
				>
					{ __( 'Reset', 'patterns-debug' ) }
				</Button>
			</Flex>
		</section>
	);
}
