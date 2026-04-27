import { useCallback, useState } from 'react';

/**
 * Manages the display state for segment content viewers (annotations, references, etc).
 *
 * Provides toggle functionality: clicking the same content type closes the viewer,
 * clicking a different type switches to that content.
 *
 * @returns {Object} Object with keys:
 *   - displayedContentType: (string|null) Currently displayed content type or null
 *   - handleToggleContentDisplay: (function) Toggle content type on/off
 *   - handleCloseContentDisplay: (function) Close the content viewer
 */
export function useContentDisplay() {
    const [displayedContentType, setDisplayedContentType] = useState(null);

    const handleToggleContentDisplay = useCallback((contentType) => {
        // Toggle: if same type is clicked, close it; otherwise switch to new type
        setDisplayedContentType((prev) =>
            prev === contentType ? null : contentType
        );
    }, []);

    const handleCloseContentDisplay = useCallback(() => {
        setDisplayedContentType(null);
    }, []);

    return {
        displayedContentType,
        handleToggleContentDisplay,
        handleCloseContentDisplay,
    };
}
