import { CSS_BASE_UNIT } from 'modules/constants';

export const NAME = 'media-player';

// Buffer space between top of active segment and Video/Menu
export const SPACE_BEFORE_ACTIVE_ELEMENT = 8 * CSS_BASE_UNIT;

export const DEFAULT_VIDEO_RESOLUTION = '480p';
export const DEFAULT_AUDIO_RESOLUTION = '192k';

// Re-export translations constants
export * from './translations';
