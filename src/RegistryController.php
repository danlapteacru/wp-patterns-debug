<?php
/**
 * REST endpoint exposing the server-side pattern registries.
 *
 * @package wp-patterns-debug
 */

declare( strict_types=1 );

namespace WpPatternsDebug;

use WP_Block_Pattern_Categories_Registry;
use WP_Block_Patterns_Registry;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Dumps the raw server-side pattern and category registries.
 *
 * The client stores only see the editor's merged view; this endpoint shows
 * exactly what PHP registered, including patterns hidden from the inserter.
 */
final class RegistryController {

	/**
	 * REST namespace for the plugin.
	 */
	public const REST_NAMESPACE = 'wp-patterns-debug/v1';

	/**
	 * Register hooks.
	 */
	public static function register(): void {
		add_action( 'rest_api_init', [ self::class, 'register_routes' ] );
	}

	/**
	 * Register the registry route.
	 */
	public static function register_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/registry',
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ self::class, 'get_registry' ],
				'permission_callback' => static fn (): bool => current_user_can( Capabilities::VIEW ),
			]
		);
	}

	/**
	 * Return every server-registered pattern and pattern category.
	 */
	public static function get_registry(): WP_REST_Response {
		return rest_ensure_response(
			[
				'patterns'   => WP_Block_Patterns_Registry::get_instance()->get_all_registered(),
				'categories' => WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
			]
		);
	}
}
