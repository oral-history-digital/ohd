/**
 * Put global constants here.
 */

const ONE_REM = 16;
export const CSS_BASE_UNIT = 24;

export const SITE_HEADER_HEIGHT_MOBILE =   5    * ONE_REM;
export const SITE_HEADER_HEIGHT_DESKTOP =  6.25 * ONE_REM;
export const MEDIA_PLAYER_HEIGHT_MOBILE =  20   * ONE_REM
export const MEDIA_PLAYER_HEIGHT_DESKTOP = 28   * ONE_REM;
export const MEDIA_PLAYER_HEIGHT_STICKY =  10   * ONE_REM;
export const CONTENT_TABS_HEIGHT =         3    * ONE_REM;
const SPACE_BEFORE_ACTIVE_ELEMENT =        1.5  * CSS_BASE_UNIT;

export const SCROLL_OFFSET = MEDIA_PLAYER_HEIGHT_STICKY + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT;

export const PROJECT_CDOH = 'cdoh'
export const PROJECT_DG   = 'dg';
export const PROJECT_MOG  = 'mog';
export const PROJECT_ZWAR = 'zwar';
export const PROJECT_CAMPSCAPES = 'campscapes';

export const DEFAULT_LOCALES = ['de', 'en'];
export const SYSTEM_LOCALES = ['de', 'en', 'el', 'es', 'ru'];

export const VIEWMODE_GRID = 'grid';
export const VIEWMODE_LIST = 'list';
export const VIEWMODE_WORKFLOW = 'workflow';

export const METADATA_SOURCE_INTERVIEW = 'Interview';
export const METADATA_SOURCE_PERSON = 'Person';
export const METADATA_SOURCE_REGISTRY_REFERENCE_TYPE = 'RegistryReferenceType';
export const METADATA_SOURCE_EVENT_TYPE = 'EventType';

export const OHD_LOCATION = 'https://portal.oral-history.digital';
export const OHD_DOMAINS = {
    development: 'http://portal.oral-history.localhost:3000',
    staging:     'https://staging.oral-history.digital',
    production:  'https://portal.oral-history.digital',
    test:        'http://test.portal.oral-history.localhost:47001'
};

const ANALYTICS_URLS = {
    development: '//localhost:8080/',
    staging: '//metrics.oral-history.digital/',
    production: '//metrics.oral-history.digital/',
};
export const ANALYTICS_URL_BASE = ANALYTICS_URLS[railsMode];
export const ANALYTICS_DEFAULT_SITE_ID = 1;

export const SHOW_SYSTEM_WARNING = false;
