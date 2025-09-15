import { filterTranscriptionTags } from './filterTranscriptionTags';

/**
 * Utility to check text direction based on different criteria
 *
 * Heuristics:
 *  - majority: count up to maxChars and pick the majority of strong chars
 *  - first-strong: return direction of first strongly directional character
 *
 * Options:
 *  - method: "majority" | "first-strong"
 *  - defaultDir: "ltr" | "rtl"
 *  - maxChars: number of characters to scan
 *  - stripTags: boolean - remove transcription tags before analysis
 */

export function checkTextDir(
    text,
    {
        method = 'majority',
        defaultDir = 'ltr',
        maxChars = 300,
        stripTags = true,
    } = {}
) {
    if (typeof text !== 'string' || text.length === 0) return defaultDir;

    const filteredText = stripTags ? filterTranscriptionTags(text) : text;

    // RTL ranges commonly used (Hebrew, Arabic, Syriac, Thaana, NKo, presentation forms, etc.)
    const rtlRe = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    // LTR: basic Latin + Latin-1 Supplement + Latin Extended ranges (covers most Latin letters)
    const ltrRe = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;

    const limit = Math.min(filteredText.length, maxChars);

    if (method === 'majority') {
        let rtlCount = 0;
        let ltrCount = 0;
        for (let i = 0; i < limit; i++) {
            const ch = filteredText[i];
            if (rtlRe.test(ch)) rtlCount++;
            else if (ltrRe.test(ch)) ltrCount++;
        }
        if (rtlCount > ltrCount) return 'rtl';
        if (ltrCount > rtlCount) return 'ltr';
    }

    // Fallback to 'first-strong' method
    for (let i = 0; i < limit; i++) {
        const ch = filteredText[i];
        if (rtlRe.test(ch)) return 'rtl';
        if (ltrRe.test(ch)) return 'ltr';
    }
    return defaultDir;
}
