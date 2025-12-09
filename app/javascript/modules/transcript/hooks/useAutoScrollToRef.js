import { useEffect } from 'react';

import { scrollSmoothlyTo } from 'modules/user-agent';

/**
 * Custom hook to auto-scroll to a ref when certain conditions are met.
 *
 * @param {object} ref - React ref to the DOM element to scroll to
 * @param {number} scrollOffset - The offset in pixels to subtract from the top
 * @param {boolean} shouldScroll - Whether to trigger the scroll
 * @param {Array} deps - Additional dependencies for the effect
 */
export function useAutoScrollToRef(ref, scrollOffset, shouldScroll, deps = []) {
    useEffect(() => {
        if (!ref.current) return;
        if (!shouldScroll) return;
        const topOfElement = ref.current.offsetTop;
        if (topOfElement === 0) return;
        scrollSmoothlyTo(0, topOfElement - scrollOffset);
    }, [ref, scrollOffset, shouldScroll, ...deps]);
}
