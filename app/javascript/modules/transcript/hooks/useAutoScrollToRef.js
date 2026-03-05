import { useEffect, useRef } from 'react';

import { getScrollOffset } from 'modules/media-player';
import { scrollSmoothlyTo } from 'modules/user-agent';

/**
 * Custom hook to auto-scroll to a ref when certain conditions are met.
 *
 * The actual scroll is deferred one animation frame so that any synchronous
 * Redux state resets (e.g. during segment preview stop) can re-render first.
 * If shouldScroll becomes false before the frame fires, the scroll is cancelled.
 * This prevents spurious scrolls from brief one-render flickers of shouldScroll.
 *
 * scrollOffset is read lazily inside the rAF callback (via getScrollOffset())
 * so that the media player's current height is used at the moment of scrolling,
 * without subscribing to resize events or holding it in state.
 *
 * @param {object} ref - React ref to the DOM element to scroll to
 * @param {boolean} shouldScroll - Whether to trigger the scroll
 * @param {Array} deps - Additional dependencies for the effect
 */
export function useAutoScrollToRef(ref, shouldScroll, deps = []) {
    const shouldScrollRef = useRef(shouldScroll);
    shouldScrollRef.current = shouldScroll;

    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (!shouldScroll) {
            hasScrolledRef.current = false;
            return;
        }
        if (hasScrolledRef.current) return;
        hasScrolledRef.current = true;

        // Defer to next frame: if shouldScroll has already flipped back to false
        // by then (e.g. mediaTime was reset after preview stop), cancel.
        const frame = requestAnimationFrame(() => {
            if (!shouldScrollRef.current) {
                hasScrolledRef.current = false;
                return;
            }
            if (!ref.current) return;
            const topOfElement = ref.current.offsetTop;
            if (topOfElement === 0) return;
            // Read scroll offset lazily at scroll time — always reflects the
            // current media player height without subscribing to resize events.
            scrollSmoothlyTo(0, topOfElement - getScrollOffset());
        });

        return () => cancelAnimationFrame(frame);
    }, [ref, shouldScroll, ...deps]);
}
