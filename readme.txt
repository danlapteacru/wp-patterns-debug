=== Patterns Debug ===
Contributors: danlapteacru
Tags: patterns, block editor, gutenberg, debug, developer
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 8.1
Stable tag: 0.1.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Pattern registry browser and block debug panel for the block editor. See every registered pattern, dump any block, and edit raw attributes.

== Description ==

A developer tool that adds two debugging surfaces to the block editor (post editor and site editor). Nothing is loaded on the front end, and nothing is loaded for users without the `edit_posts` capability.

**Pattern browser**

A pinnable *Patterns Debug* sidebar listing every pattern the editor knows about:

* Registered patterns from the client stores (core, theme, plugin, pattern directory), plus user patterns (`wp_block` posts) with their sync status.
* Search, plus source and category filters.
* Per pattern: metadata (source, categories, block types, sync status, inserter visibility), a recursive block-usage count, copy name or content, a JSON dump, and a live preview.
* A *Server registry* section backed by a REST endpoint that dumps the raw server-side `WP_Block_Patterns_Registry` and category registry, including patterns hidden from the inserter, exactly as PHP registered them.

**Block debug panel**

A *Debug* panel in the block inspector for the selected block, and the same panel as *Selected block* at the top of the sidebar. The sidebar copy matters: the block inspector renders no panels at all for synced pattern instances (`core/block`), so the sidebar is the only place they can be debugged.

* Overview (name, client ID) with copy actions.
* Dumps: block instance, block type, the wrapper element's rendered DOM attributes, serialized block HTML.
* Attributes editor: the block's attributes as raw, validated JSON. Apply or reset; deleting a key removes the attribute; keys outside the block type's attribute schema are flagged but allowed.
* Pattern provenance: shows when the selected block is a synced pattern instance (`core/block` ref, `wp_block` record, per-instance overrides) or was inserted from a pattern (`metadata.patternName`), with dumps of the source pattern.

**Access control**

Every debug surface (editor assets and the REST endpoint) requires the `view_patterns_debug` capability, mapped to `edit_posts` by default. Remap it by filtering `map_meta_cap` at a priority above `0`:

`
add_filter( 'map_meta_cap', function ( $caps, $cap ) {
    if ( 'view_patterns_debug' === $cap ) {
        $caps = [ 'manage_options' ];
    }
    return $caps;
}, 10, 2 );
`

**Source code**

The editor script is built from TypeScript with `@wordpress/scripts`. The source is included in this plugin under `entries/`, and the full project with build tooling is at [github.com/danlapteacru/wp-patterns-debug](https://github.com/danlapteacru/wp-patterns-debug). To rebuild: `npm install && npm run build`.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` or install it from the Plugins screen.
2. Activate it.
3. Open any post or template in the block editor. The *Patterns Debug* sidebar is in the editor's plugins menu (the puzzle-piece icon), and the *Debug* panel appears in the block inspector when a block is selected.

No settings page. Deactivate the plugin to remove everything; it stores no options.

== Frequently Asked Questions ==

= Does this affect the front end of my site? =

No. Assets are only enqueued in the block editor, and only for users with the required capability.

= Who can see the debug tools? =

By default anyone who can edit posts. Filter `map_meta_cap` for the `view_patterns_debug` capability to restrict it further, for example to administrators only.

= Why is there a separate sidebar as well as the inspector panel? =

Because the block inspector shows nothing for synced pattern instances (`core/block`). The sidebar's *Selected block* panel works for every block, including those.

= What does the REST endpoint expose? =

`wp-patterns-debug/v1/registry` returns the server-side pattern and category registries. It is read-only and requires the same capability as the editor UI.

= Does it store any data? =

No options, no post meta, no transients. Uninstalling leaves nothing behind.

== Screenshots ==

1. Debug panel in the block inspector: overview, dumps, serialized HTML and the raw JSON attributes editor.
2. Dump modal with a pretty-printed, copyable block instance.
3. Pattern browser with search, filters, metadata, block counts and live previews.
4. Selected block panel showing synced pattern provenance for a `core/block` instance.
5. Server registry dump, including patterns hidden from the inserter.

== Changelog ==

= 0.1.1 =
* Initial release on WordPress.org.

== Upgrade Notice ==

= 0.1.1 =
First public release.
