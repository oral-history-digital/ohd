import { getScrollOffset } from './getScrollOffset';

// Mock constants used in the function
jest.mock('modules/constants', () => ({
    CONTENT_TABS_HEIGHT: 48, // e.g. 3rem * 16px
    CSS_BASE_UNIT: 24,
}));
jest.mock('modules/media-player', () => ({
    DEFAULT_PLAYER_SIZE: 'medium',
    MEDIA_PLAYER_HEIGHT_MEDIUM: 448, // 28rem * 16px
    MEDIA_PLAYER_HEIGHT_SMALL: 200, // 12.5rem * 16px
    MEDIA_PLAYER_HEIGHT_MOBILE: 320, // 20rem * 16px
}));

describe('getScrollOffset', () => {
    const SPACE_BEFORE_ACTIVE_ELEMENT = 1.5 * 24; // 36
    const CONTENT_TABS_HEIGHT = 48;
    const HEIGHTS = {
        medium: 448,
        small: 200,
        mobile: 320,
    };

    beforeEach(() => {
        // Reset window.innerWidth before each test
        window.innerWidth = 1024;
    });

    it('returns correct offset for medium size on desktop', () => {
        window.innerWidth = 1024;
        expect(getScrollOffset('medium')).toBe(
            HEIGHTS.medium + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT
        );
    });

    it('returns correct offset for small size on desktop', () => {
        window.innerWidth = 1024;
        expect(getScrollOffset('small')).toBe(
            HEIGHTS.small + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT
        );
    });

    it('returns correct offset for mobile size on small screens', () => {
        window.innerWidth = 500;
        expect(getScrollOffset('medium')).toBe(
            HEIGHTS.mobile + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT
        );
        expect(getScrollOffset('small')).toBe(
            HEIGHTS.mobile + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT
        );
    });

    it('falls back to default size if invalid size is passed', () => {
        window.innerWidth = 1024;
        expect(getScrollOffset('invalid')).toBe(
            HEIGHTS.medium + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT
        );
    });

    it('throws if any height constant is missing', () => {
        jest.resetModules();
        jest.doMock('modules/media-player', () => ({
            DEFAULT_PLAYER_SIZE: 'medium',
            MEDIA_PLAYER_HEIGHT_MEDIUM: undefined,
            MEDIA_PLAYER_HEIGHT_SMALL: undefined,
            MEDIA_PLAYER_HEIGHT_MOBILE: undefined,
        }));
        return import('./getScrollOffset').then(
            ({ getScrollOffset: brokenGetScrollOffset }) => {
                expect(() => brokenGetScrollOffset('medium')).toThrow();
            }
        );
    });
});
