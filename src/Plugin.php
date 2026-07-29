<?php
/**
 * Plugin bootstrap.
 *
 * @package wp-patterns-debug
 */

declare( strict_types=1 );

namespace WpPatternsDebug;

/**
 * Wires up the plugin's features.
 */
final class Plugin {

	/**
	 * Register all hooks.
	 */
	public static function boot(): void {
		Capabilities::register();
		Assets::register();
		RegistryController::register();
	}
}
