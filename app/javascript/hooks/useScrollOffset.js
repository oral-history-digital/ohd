import { getPlayerSize } from 'modules/media-player';
import { useSelector } from 'react-redux';
import { getScrollOffset } from 'utils/getScrollOffset';

/**
 * React hook to get the current scroll offset based on the Redux player size.
 * Returns the offset in pixels for smooth scrolling.
 *
 * @returns {number} The scroll offset in pixels
 */
export function useScrollOffset() {
    const playerSize = useSelector(getPlayerSize);
    return getScrollOffset(playerSize);
}
