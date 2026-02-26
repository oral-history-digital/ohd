import { useEffect, useRef } from 'react';

import { scrollSmoothlyTo } from 'modules/user-agent';

/**
 * Custom hook to auto-scroll to a ref when certain conditions are met.
 *
 * The actual scroll is deferred one animation frame so that any synchronous
 * Redux state resets (e.g. during segment preview stop) can re-render first.
 * If shouldScroll becomes false before the frame fires, the scroll is cancelled.
 * This prevents spurious scrolls from brief one-render flickers of shouldScroll.
 *
 * @param {object} ref - React ref to the DOM element to scroll to
 * @param {number} scrollOffset - The offset in pixels to subtract from the top
 * @param {boolean} shouldScroll - Whether to trigger the scroll
 * @param {Array} deps - Additional dependencies for the effect
 */
export function useAutoScrollToRef(ref, scrollOffset, shouldScroll, deps = []) {
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
            scrollSmoothlyTo(0, topOfElement - scrollOffset);
        });

        return () => cancelAnimationFrame(frame);
    }, [ref, scrollOffset, shouldScroll, ...deps]);
}
