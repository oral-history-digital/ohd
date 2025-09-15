/**
 * Remove or normalize transcription-style tags from a string.
 *
 * Behavior:
 * - Completely removes tags such as <l(...) ...>, <v(...)>, <n(...)>, <i(...)>, and pause tags like <p2>.
 * - For tags of the form `<s(...) KEEP>`, `<nl(...) KEEP>`, `<g(...) KEEP>` (or `[KEEP]` variants),
 *   the KEEP text is preserved and the rest of the tag removed.
 * - Also preserves trailing KEEP text for tags like `<sim KEEP>`, `<res KEEP>`, `<an KEEP>`, and `<? KEEP>`.
 * - Collapses multiple spaces and removes stray space before punctuation.
 *
 * @param {string} text - The transcription text to clean. If a non-string is provided, it is returned unchanged.
 * @returns {string} The cleaned text with tags removed or replaced according to the rules above.
 *
 * @example
 * filterTranscriptionTags('This is <s(Sprechweise) SPEAK STYLE>, ok.')
 * // -> 'This is SPEAK STYLE, ok.'
 *
 * Notes:
 * - The function uses regex heuristics. KEEP strings should not contain '>' or ']'—if tag contents can be nested
 *   or contain those characters, consider a proper parser/tokenizer for correctness.
 */

export function filterTranscriptionTags(text) {
    if (typeof text !== 'string') return text;

    let out = text;

    // For tags like <s(...) KEEP> or <nl(...) KEEP> or <g(...) KEEP>
    // capture the content after the parentheses up to the closing '>' and keep it.
    out = out.replace(/<\s*(?:s|nl|g)\([^>]*\)\s*([^>]+?)>/gi, ' $1 ');

    // Tags like <sim KEEP>, <res KEEP>, <an KEEP>, and <? KEEP>
    // Keep the trailing string before '>' and remove the rest of the tag.
    out = out.replace(/<\s*(?:sim|res|an|\?)\s*([^>]+?)>/gi, ' $1 ');

    // Remove tags that should be ignored completely (no KEEP to preserve)
    out = out.replace(/<\s*(?:l|v|n|i)[^>]*>/gi, '');

    // Remove pause tags like <p2>, <p3>, etc.
    out = out.replace(/<\s*p\d+\s*>/gi, '');

    // Collapse multiple spaces left by removals.
    out = out.replace(/\s+/g, ' ');

    // Remove space before punctuation (commas, periods, etc.).
    out = out.replace(/\s+([,.;:!?])/g, '$1');

    return out.trim();
}
