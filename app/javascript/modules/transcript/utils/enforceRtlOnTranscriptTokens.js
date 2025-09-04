/**
 * Wraps transcript tokens with RTL-isolate so they render correctly inside RTL text.
 * - Uses RLI (U+2067) ... PDI (U+2069)
 * - Optionally fences with RLM (U+200F) on both sides to stabilize punctuation.
 */
export function enforceRtlOnTranscriptTokens(
    text,
    { fenceWithRLM = true } = {}
) {
    if (typeof text !== 'string' || text.length === 0) return text ?? '';

    const RLI = '\u2067'; // Right-to-Left Isolate
    const PDI = '\u2069'; // Pop Directional Isolate
    const RLM = '\u200F'; // Right-to-Left Mark

    // Matches:
    // - <sim ...>, <res ...>, <an ...>, <? ...>, <p2>, <p10> ...
    // - <s(...)>, <nl(...)>, <g(...)>, <l(...)>, <v(...)>, <n(...)>, <i(...)>
    const tokenRegex =
        /<\s*(?:(?:sim|res|an|\?|p\d+)(?:\s+[^<>]*?)?|(?:s|nl|g|l|v|n|i)\s*\([^<>]*?\))\s*>/g;

    return text.replace(tokenRegex, (m) => {
        const wrapped = `${RLI}${m}${PDI}`;
        return fenceWithRLM ? `${RLM}${wrapped}${RLM}` : wrapped;
    });
}
