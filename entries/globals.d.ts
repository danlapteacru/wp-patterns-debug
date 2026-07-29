// Minimal declarations for @wordpress packages that don't ship types,
// covering only the APIs this plugin uses.

declare module '@wordpress/block-editor' {
  import type { ComponentType, ReactNode } from 'react';

  export const InspectorControls: ComponentType<{ children: ReactNode }>;
  export const BlockPreview: ComponentType<{ blocks: unknown; viewportWidth?: number }>;
}

declare module '@wordpress/blocks' {
  export interface BlockInstance {
    name: string;
    clientId: string;
    attributes: Record<string, unknown>;
    innerBlocks: BlockInstance[];
  }

  export function parse(content: string): BlockInstance[];
  export function serialize(blocks: BlockInstance | BlockInstance[]): string;

  export const store: any;
}
