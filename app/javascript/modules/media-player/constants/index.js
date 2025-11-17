export const NAME = 'media-player';

export const DEFAULT_VIDEO_RESOLUTION = '480p';
export const DEFAULT_AUDIO_RESOLUTION = '192k';

// Video player sizes (must match SCSS variables in app/javascript/stylesheets/_variables.scss)
export const VIDEO_MAX_WIDTH_SMALL = '20rem'; // $media-player-video-max-width-small
export const VIDEO_MAX_WIDTH_MEDIUM = '50rem'; // $media-player-video-max-width

// Resize constraints (numeric values in rem for drag handle)
export const VIDEO_RESIZE_MIN_WIDTH = 10; // Minimum width in rem
export const VIDEO_RESIZE_MAX_WIDTH = 60; // Maximum width in rem

// Compact mode threshold - when video width falls below this, use compact header layout
export const VIDEO_COMPACT_MODE_THRESHOLD = 15; // Width in rem

// Re-export translations constants
export * from './translations';
