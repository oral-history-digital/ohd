import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to handle manual resizing of the media player via drag handle
 * Maintains aspect ratio while resizing
 *
 * @param {Object} options
 * @param {number} options.minWidth - Minimum width in rem
 * @param {number} options.maxWidth - Maximum width in rem
 * @returns {Object} - { resizeHandleRef, isDragging }
 */
export function useMediaPlayerResize({ minWidth = 20, maxWidth = 60 } = {}) {
    const [isDragging, setIsDragging] = useState(false);
    const handleElementRef = useRef(null);
    const listenersAttachedRef = useRef(false);

    // Restore saved width on mount
    useEffect(() => {
        const savedWidth = sessionStorage.getItem('videoPlayerWidth');
        if (savedWidth) {
            document.documentElement.style.setProperty(
                '--media-player-video-max-width',
                savedWidth
            );
        }
    }, []);

    // Callback ref to attach/reattach listeners when the DOM element changes
    const resizeHandleRef = useCallback(
        (handle) => {
            // Clean up previous listeners if they exist
            if (handleElementRef.current && listenersAttachedRef.current) {
                const oldHandle = handleElementRef.current;
                const oldListener = oldHandle._mousedownListener;
                if (oldListener) {
                    oldHandle.removeEventListener(
                        'mousedown',
                        oldListener,
                        true
                    );
                }
                listenersAttachedRef.current = false;
            }

            // Store the new handle element
            handleElementRef.current = handle;

            if (!handle) return;

            // Only enable resize on medium+ screens (768px)
            const isCompactScreen = () => window.innerWidth < 768;
            if (isCompactScreen()) {
                return;
            }

            let startX = 0;
            let startWidth = 0;
            let currentMediaElement = null;

            const handleMouseMove = (e) => {
                if (!currentMediaElement) return;
                e.preventDefault();

                const deltaX = e.clientX - startX;
                const newWidthPx = startWidth + deltaX;

                // Convert to rem (assuming 16px = 1rem)
                const newWidthRem = newWidthPx / 16;

                // Constrain to min/max
                const constrainedWidthRem = Math.max(
                    minWidth,
                    Math.min(maxWidth, newWidthRem)
                );

                // Update CSS custom property
                document.documentElement.style.setProperty(
                    '--media-player-video-max-width',
                    `${constrainedWidthRem}rem`
                );

                // Save to sessionStorage
                sessionStorage.setItem(
                    'videoPlayerWidth',
                    `${constrainedWidthRem}rem`
                );
            };

            const handleMouseUp = () => {
                setIsDragging(false);
                document.removeEventListener(
                    'mousemove',
                    handleMouseMove,
                    true
                );
                document.removeEventListener('mouseup', handleMouseUp, true);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                currentMediaElement = null;
            };

            const handleMouseDown = (e) => {
                if (isCompactScreen()) return;

                // Get mediaElement fresh on each mousedown
                currentMediaElement = handle.closest('.MediaElement');
                if (!currentMediaElement) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);

                startX = e.clientX;
                startWidth = currentMediaElement.offsetWidth;

                document.addEventListener('mousemove', handleMouseMove, true);
                document.addEventListener('mouseup', handleMouseUp, true);
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
            };

            // Store listener on element for cleanup
            handle._mousedownListener = handleMouseDown;
            handle.addEventListener('mousedown', handleMouseDown, true);
            listenersAttachedRef.current = true;
        },
        [minWidth, maxWidth]
    );

    return { resizeHandleRef, isDragging };
}
