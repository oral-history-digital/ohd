import { useMemo } from 'react';

import { checkTextDir, enforceRtlOnTranscriptTokens } from '../utils';

/**
 * Processes segment text based on content locale and edit permissions.
 *
 * Returns the appropriate text (public or full) and its text direction.
 * Enforces RTL wrapping if text direction is RTL.
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.segment - The segment object with text property
 * @param {string} options.contentLocale - The locale to display content in
 * @param {boolean} options.canEditSegment - Whether the user can edit this segment
 *
 * @returns {Object} Object with keys:
 *   - text: The processed text content (or null if no text available)
 *   - textDir: Text direction ('ltr' or 'rtl')
 */
export function useProcessedSegmentText({
    segment,
    contentLocale,
    canEditSegment,
}) {
    return useMemo(() => {
        let text = canEditSegment
            ? segment.text[contentLocale] ||
              segment.text[`${contentLocale}-public`]
            : segment.text[`${contentLocale}-public`];

        const textDir = checkTextDir(text);
        // Enforce RTL wrapping if the text direction is RTL
        text = textDir === 'rtl' ? enforceRtlOnTranscriptTokens(text) : text;

        return { text, textDir };
    }, [segment, contentLocale, canEditSegment]);
}
