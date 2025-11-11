import { getScrollOffset } from './getScrollOffset';

// Mock constants used in the function
jest.mock('modules/media-player', () => ({
    SPACE_BEFORE_ACTIVE_ELEMENT: 36, // 1.5 * 24
}));

describe('getScrollOffset', () => {
    const SPACE_BEFORE_ACTIVE_ELEMENT = 36;

    beforeEach(() => {
        // Clear the DOM before each test
        document.body.innerHTML = '';
    });

    it('returns correct offset when both elements exist', () => {
        // Create mock DOM elements
        const mediaPlayer = document.createElement('div');
        mediaPlayer.className = 'MediaPlayer';
        Object.defineProperty(mediaPlayer, 'offsetHeight', {
            configurable: true,
            value: 400,
        });

        const contentTabs = document.createElement('div');
        contentTabs.className = 'Layout-contentTabs';
        Object.defineProperty(contentTabs, 'offsetHeight', {
            configurable: true,
            value: 48,
        });

        document.body.appendChild(mediaPlayer);
        document.body.appendChild(contentTabs);

        expect(getScrollOffset()).toBe(400 + 48 + SPACE_BEFORE_ACTIVE_ELEMENT);
    });

    it('returns correct offset with different heights', () => {
        // Create mock DOM elements with different heights
        const mediaPlayer = document.createElement('div');
        mediaPlayer.className = 'MediaPlayer';
        Object.defineProperty(mediaPlayer, 'offsetHeight', {
            configurable: true,
            value: 320,
        });

        const contentTabs = document.createElement('div');
        contentTabs.className = 'Layout-contentTabs';
        Object.defineProperty(contentTabs, 'offsetHeight', {
            configurable: true,
            value: 48,
        });

        document.body.appendChild(mediaPlayer);
        document.body.appendChild(contentTabs);

        expect(getScrollOffset()).toBe(320 + 48 + SPACE_BEFORE_ACTIVE_ELEMENT);
    });

    it('returns SPACE_BEFORE_ACTIVE_ELEMENT when elements do not exist', () => {
        // No elements in DOM
        expect(getScrollOffset()).toBe(SPACE_BEFORE_ACTIVE_ELEMENT);
    });

    it('handles missing MediaPlayer element', () => {
        // Only contentTabs exists
        const contentTabs = document.createElement('div');
        contentTabs.className = 'Layout-contentTabs';
        Object.defineProperty(contentTabs, 'offsetHeight', {
            configurable: true,
            value: 48,
        });

        document.body.appendChild(contentTabs);

        expect(getScrollOffset()).toBe(48 + SPACE_BEFORE_ACTIVE_ELEMENT);
    });

    it('handles missing contentTabs element', () => {
        // Only MediaPlayer exists
        const mediaPlayer = document.createElement('div');
        mediaPlayer.className = 'MediaPlayer';
        Object.defineProperty(mediaPlayer, 'offsetHeight', {
            configurable: true,
            value: 400,
        });

        document.body.appendChild(mediaPlayer);

        expect(getScrollOffset()).toBe(400 + SPACE_BEFORE_ACTIVE_ELEMENT);
    });

    it('returns correct offset when elements have zero height', () => {
        // Create mock DOM elements with zero height
        const mediaPlayer = document.createElement('div');
        mediaPlayer.className = 'MediaPlayer';
        Object.defineProperty(mediaPlayer, 'offsetHeight', {
            configurable: true,
            value: 0,
        });

        const contentTabs = document.createElement('div');
        contentTabs.className = 'Layout-contentTabs';
        Object.defineProperty(contentTabs, 'offsetHeight', {
            configurable: true,
            value: 0,
        });

        document.body.appendChild(mediaPlayer);
        document.body.appendChild(contentTabs);

        expect(getScrollOffset()).toBe(SPACE_BEFORE_ACTIVE_ELEMENT);
    });
});
