import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';

export interface ServerPattern {
	name: string;
	[ key: string ]: unknown;
}

export interface ServerRegistry {
	patterns: ServerPattern[];
	categories: Record< string, unknown >[];
}

export type ServerRegistryState =
	| { status: 'loading' }
	| { status: 'error'; message?: string }
	| { status: 'success'; registry: ServerRegistry };

/** Fetch the raw server-side registries from the plugin's REST endpoint. */
export default function useServerRegistry(): ServerRegistryState {
	const [ state, setState ] = useState< ServerRegistryState >( {
		status: 'loading',
	} );

	useEffect( () => {
		let cancelled = false;

		apiFetch< ServerRegistry >( { path: '/wp-patterns-debug/v1/registry' } )
			.then( ( registry ) => {
				if ( ! cancelled ) {
					setState( { status: 'success', registry } );
				}
			} )
			.catch( ( error: { message?: string } ) => {
				if ( ! cancelled ) {
					// Translation of the fallback happens at the render site.
					setState( { status: 'error', message: error?.message } );
				}
			} );

		return () => {
			cancelled = true;
		};
	}, [] );

	return state;
}
