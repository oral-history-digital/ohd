import { CSS_BASE_UNIT, ONE_REM } from 'modules/constants';

export const NAME = 'media-player';

// Same as in app/javascript/stylesheets/_variables.scss
export const BREAKPOINTS = {
    xs: 480,
    s: 520,
    m: 768,
    l: 990,
    xl: 1200,
};

export const DEFAULT_PLAYER_SIZE = {
    xs: 'medium',
    s: 'medium',
    m: 'small',
    l: 'small',
    xl: 'medium',
};

// Important: These values have to be in sync with the values
// defined in /app/javascript/stylesheets/_variables.scss
export const MEDIA_PLAYER_HEIGHT_SMALL = 12.5 * ONE_REM;
export const MEDIA_PLAYER_HEIGHT_MEDIUM = 28 * ONE_REM;
export const MEDIA_PLAYER_HEIGHT_MOBILE = 20 * ONE_REM;

// Buffer space between top of active segment and Video/Menu
export const SPACE_BEFORE_ACTIVE_ELEMENT = 8 * CSS_BASE_UNIT;

export const DEFAULT_VIDEO_RESOLUTION = '480p';
export const DEFAULT_AUDIO_RESOLUTION = '192k';

// Re-export translations constants
export * from './translations';
