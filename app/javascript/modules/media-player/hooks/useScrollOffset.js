import { useEffect, useState } from 'react';

import { getScrollOffset } from 'modules/media-player';

/**
 * React hook to get the current scroll offset by reading DOM element heights.
 * Returns the offset in pixels for smooth scrolling.
 *
 * Automatically recalculates when:
 * - Window is resized
 * - Media player or content tabs change size
 *
 * @returns {number} The scroll offset in pixels
 */
export function useScrollOffset() {
    const [offset, setOffset] = useState(() => getScrollOffset());

    useEffect(() => {
        // Recalculate offset on window resize
        const handleResize = () => {
            setOffset(getScrollOffset());
        };

        // Observe size changes to media player element
        const mediaPlayer = document.querySelector('.MediaPlayer');
        let resizeObserver;

        if (mediaPlayer && typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                setOffset(getScrollOffset());
            });
            resizeObserver.observe(mediaPlayer);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, []);

    return offset;
}
