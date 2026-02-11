/**
 * Utility for transforming bracket notation attribute names into nested objects.
 *
 * This is specific to AccessConfig form submission where FormComponent treats
 * attribute names as literal strings, but Rails expects nested hashes for setter methods.
 */

/**
 * Transform bracket notation attribute names into nested objects.
 *
 * Converts:
 *   { '[organization_setter]display': true, '[organization_setter]obligatory': false }
 * To:
 *   { organization_setter: { display: true, obligatory: false } }
 *
 * Also handles three-level nesting:
 *   '[job_description_setter][values]researcher' → { job_description_setter: { values: { researcher: true } } }
 *
 * @param {Object} params - Form parameters with scope key (e.g., { access_config: {...} })
 * @returns {Object} Transformed parameters with nested structure
 */
export function transformBracketNotationToNested(params) {
    const scopeKey = Object.keys(params)[0];
    const values = params[scopeKey];

    // Check if any keys contain bracket notation
    const hasBracketNotation = Object.keys(values).some(
        (key) => key.startsWith('[') && key.includes(']')
    );

    if (!hasBracketNotation) {
        // No transformation needed
        return params;
    }

    const nested = {};

    Object.entries(values).forEach(([key, value]) => {
        // Match pattern: [first_level]remaining
        const firstMatch = key.match(/^\[([^\]]+)\](.*)$/);

        if (firstMatch) {
            const [, firstLevel, remaining] = firstMatch;

            // Match pattern: [second_level]final_key (three-level nesting)
            const secondMatch = remaining.match(/^\[([^\]]+)\](.+)$/);

            if (secondMatch) {
                // Three-level nesting: [job_description_setter][values]researcher
                const [, secondLevel, finalKey] = secondMatch;
                nested[firstLevel] = nested[firstLevel] || {};
                nested[firstLevel][secondLevel] =
                    nested[firstLevel][secondLevel] || {};
                nested[firstLevel][secondLevel][finalKey] = value;
            } else {
                // Two-level nesting: [organization_setter]display
                const finalKey = remaining;
                nested[firstLevel] = nested[firstLevel] || {};
                nested[firstLevel][finalKey] = value;
            }
        } else {
            // No bracket notation - keep as is
            nested[key] = value;
        }
    });

    return { [scopeKey]: nested };
}
