import { CSS_BASE_UNIT } from 'modules/constants';

export const NAME = 'media-player';

// Buffer space between top of active segment and Video/Menu
export const SPACE_BEFORE_ACTIVE_ELEMENT = 8 * CSS_BASE_UNIT;

export const DEFAULT_VIDEO_RESOLUTION = '480p';
export const DEFAULT_AUDIO_RESOLUTION = '192k';

// Breakpoints (must match SCSS variables in app/javascript/stylesheets/_variables.scss)
export const SCREEN_M = 768; // $screen-m
export const SCREEN_L = 990; // $screen-l
export const SCREEN_XL = 1200; // $screen-xl

// Video player sizes (must match SCSS variables in app/javascript/stylesheets/_variables.scss)
export const VIDEO_MAX_WIDTH_SMALL = '20rem'; // $media-player-video-max-width-small
export const VIDEO_MAX_WIDTH_MEDIUM = '50rem'; // $media-player-video-max-width

// Resize constraints (numeric values in rem for drag handle)
export const VIDEO_RESIZE_MIN_WIDTH = 10; // Minimum width in rem
export const VIDEO_RESIZE_MAX_WIDTH = 60; // Maximum width in rem

// Re-export translations constants
export * from './translations';
