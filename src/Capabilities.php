<?php
/**
 * Access control for the debug tools.
 *
 * @package wp-patterns-debug
 */

declare( strict_types=1 );

namespace WpPatternsDebug;

/**
 * Maps the plugin's meta capability to a primitive one.
 *
 * Sites can remap access by filtering `map_meta_cap` for the
 * `view_patterns_debug` capability at a later priority.
 */
final class Capabilities {

	/**
	 * Meta capability that gates every debug surface (assets and REST).
	 */
	public const VIEW = 'view_patterns_debug';

	/**
	 * Register hooks.
	 */
	public static function register(): void {
		add_filter( 'map_meta_cap', [ self::class, 'map_meta_cap' ], 0, 2 );
	}

	/**
	 * Map `view_patterns_debug` to `edit_posts` by default.
	 *
	 * @param string[] $caps Primitive capabilities required.
	 * @param string   $cap  Capability being checked.
	 * @return string[]
	 */
	public static function map_meta_cap( array $caps, string $cap ): array {
		if ( self::VIEW === $cap ) {
			$caps = [ 'edit_posts' ];
		}

		return $caps;
	}
}
