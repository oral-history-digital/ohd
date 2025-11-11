import { SPACE_BEFORE_ACTIVE_ELEMENT } from 'modules/media-player';

/**
 * Calculates the scroll offset for smooth scrolling by reading actual DOM element heights.
 * This ensures the active element is visible below the media player and content tabs.
 *
 * The offset is calculated dynamically based on the current rendered heights,
 * which automatically adapt to different screen sizes via CSS custom properties.
 *
 * @returns {number} The scroll offset in pixels
 */

export function getScrollOffset() {
    // Query DOM elements to get their actual rendered heights
    const mediaPlayer = document.querySelector('.MediaPlayer');
    const contentTabs = document.querySelector('.Layout-contentTabs');

    // Get actual heights, fallback to 0 if elements don't exist yet
    const playerHeight = mediaPlayer?.offsetHeight || 0;
    const tabsHeight = contentTabs?.offsetHeight || 0;

    return playerHeight + tabsHeight + SPACE_BEFORE_ACTIVE_ELEMENT;
}
