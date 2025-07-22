import { CONTENT_TABS_HEIGHT, CSS_BASE_UNIT } from 'modules/constants';
import {
    DEFAULT_PLAYER_SIZE,
    MEDIA_PLAYER_HEIGHT_MEDIUM,
    MEDIA_PLAYER_HEIGHT_MOBILE,
    MEDIA_PLAYER_HEIGHT_SMALL,
} from 'modules/media-player';

/**
 * Calculates the scroll offset for smooth scrolling based on the current player size.
 * This ensures the active element is visible below the media player and content tabs.
 *
 * @param {('small'|'medium')} playerSize - The current player size (default: DEFAULT_PLAYER_SIZE)
 * @returns {number} The scroll offset in pixels
 */

const SPACE_BEFORE_ACTIVE_ELEMENT = 1.5 * CSS_BASE_UNIT;

export function getScrollOffset(playerSize = DEFAULT_PLAYER_SIZE) {
    if (playerSize !== 'small' && playerSize !== 'medium') {
        playerSize = DEFAULT_PLAYER_SIZE; // Fallback to default if invalid size
    }

    if (
        !MEDIA_PLAYER_HEIGHT_SMALL ||
        !MEDIA_PLAYER_HEIGHT_MEDIUM ||
        !MEDIA_PLAYER_HEIGHT_MOBILE
    ) {
        throw new Error(
            'Media player heights are not defined. Please check your constants.'
        );
    }

    let playerHeight;
    if (window.innerWidth < 768) {
        // $screen-m = 768px
        playerHeight = MEDIA_PLAYER_HEIGHT_MOBILE;
    } else {
        playerHeight =
            playerSize === 'small'
                ? MEDIA_PLAYER_HEIGHT_SMALL
                : MEDIA_PLAYER_HEIGHT_MEDIUM;
    }

    return playerHeight + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_ELEMENT;
}
