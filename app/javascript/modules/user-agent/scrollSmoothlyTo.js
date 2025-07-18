/**
 * Smoothly scrolls the window to the specified left and top coordinates.
 * Uses a small delay to ensure DOM layout is stable before scrolling,
 * improving reliability across browsers (especially Firefox and Chrome).
 * Falls back to instant scroll if smooth behavior is not supported or fails.
 *
 * @param {number} left - The horizontal scroll position.
 * @param {number} top - The vertical scroll position.
 */
export default function scrollSmoothlyTo(left, top) {
    const isSmoothScrollSupported =
        'scrollBehavior' in document.documentElement.style;

    if (isSmoothScrollSupported) {
        // Defer scroll to next frame to avoid forced reflow
        requestAnimationFrame(() => {
            try {
                window.scrollTo({
                    left,
                    top,
                    behavior: 'smooth',
                });
            } catch (error) {
                console.warn(
                    'scrollSmoothlyTo: Smooth scroll failed, falling back to instant scroll',
                    error
                );
                window.scrollTo(left, top);
            }
        });
    } else {
        window.scrollTo(left, top);
    }
}
