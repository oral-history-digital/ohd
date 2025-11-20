import { ONE_REM, SCREEN_M } from 'modules/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    VIDEO_COMPACT_MODE_THRESHOLD,
    VIDEO_RESIZE_MAX_WIDTH,
    VIDEO_RESIZE_MIN_WIDTH,
} from '../constants';

/**
 * Toggle compact mode for MediaHeader based on video width
 * @param {number} widthInRem - Video width in rem units
 */
function toggleCompactMode(widthInRem) {
    const mediaHeader = document.querySelector('.MediaHeader');
    if (!mediaHeader) return;

    if (widthInRem < VIDEO_COMPACT_MODE_THRESHOLD) {
        mediaHeader.classList.add('MediaHeader--compact');
    } else {
        mediaHeader.classList.remove('MediaHeader--compact');
    }
}

/**
 * Throttle helper - limits function calls to once per delay period
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

/**
 * Hook to handle manual resizing of the media player via drag handle
 * Maintains aspect ratio while resizing
 *
 * @param {Object} options
 * @param {number} options.minWidth - Minimum width in rem
 * @param {number} options.maxWidth - Maximum width in rem
 * @returns {Object} - { resizeHandleRef, isDragging }
 */
export function useMediaPlayerResize({
    minWidth = VIDEO_RESIZE_MIN_WIDTH,
    maxWidth = VIDEO_RESIZE_MAX_WIDTH,
} = {}) {
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

            // Check if we need to apply compact mode
            const widthValue = parseFloat(savedWidth);
            if (!isNaN(widthValue)) {
                toggleCompactMode(widthValue);
            }
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
            const isCompactScreen = () => window.innerWidth < SCREEN_M;
            if (isCompactScreen()) {
                return;
            }

            let startX = 0;
            let startWidth = 0;
            let currentMediaElement = null;

            // Throttle layout update event to once every 50ms for performance
            const dispatchLayoutUpdate = throttle(() => {
                window.dispatchEvent(new CustomEvent('mediaPlayerResized'));
            }, 50);

            const handleMouseMove = (e) => {
                if (!currentMediaElement) return;
                e.preventDefault();

                // Calculate new width using mouse delta
                const deltaX = e.clientX - startX;
                const newWidthPx = startWidth + deltaX;

                // Convert to rem
                const newWidthRem = newWidthPx / ONE_REM;

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

                // Toggle compact mode for MediaHeader based on video width
                toggleCompactMode(constrainedWidthRem);

                // Dispatch custom event to notify layout that player size changed
                // This allows the sticky layout to recalculate positions in real-time
                // Throttled to avoid excessive updates during drag
                dispatchLayoutUpdate();
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
