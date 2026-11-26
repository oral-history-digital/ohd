/**
 * Suggests unambiguous file labels, preserving existing matches and manual edits.
 * Initials may match a whole label or its final underscore/hyphen-separated token.
 *
 * @param {Array<Object>} contributions - Participants with IDs, person IDs, and designations.
 * @param {Object<string, Object>} people - People keyed by ID, including their initials.
 * @param {string[]|null} speakerOptions - Labels discovered in the uploaded file.
 * @param {Set<number|string>} [editedIds] - Contributions whose mappings were edited manually.
 * @returns {Array<Object>} Suggested contributions without mutating any inputs.
 */
export function suggestSpeakerMappings(
    contributions,
    people,
    speakerOptions,
    editedIds = new Set()
) {
    if (!speakerOptions?.length || !people) return contributions;

    // Normalize only for comparison; keep the file's exact label in the result.
    const normalize = (text) => (text || '').trim().toUpperCase();
    const candidates = contributions.map((contribution) => {
        const current = contribution.speaker_designation || '';
        // Keep manual choices and existing file matches, and reserve them in the
        // candidate list so another participant is not assigned the same label.
        if (
            editedIds.has(contribution.id) ||
            speakerOptions.includes(current)
        ) {
            return current;
        }
        const storedMatches = speakerOptions.filter(
            (label) => normalize(label) === normalize(current)
        );
        const initials = normalize(people[contribution.person_id]?.initials);
        // Prefer the stored designation over initials. For initials, "IP_MH"
        // and "speaker-MH" both match "MH"; unrelated substrings do not match.
        const matches = storedMatches.length
            ? storedMatches
            : speakerOptions.filter(
                  (label) =>
                      initials &&
                      normalize(label).split(/[_-]/).pop() === initials
              );
        // Several possible labels for one participant are ambiguous: do not guess.
        return matches.length === 1 ? matches[0] : '';
    });

    return contributions.map((contribution, index) => {
        if (editedIds.has(contribution.id)) return contribution;
        const candidate = candidates[index];
        // A label must also belong to just one participant, including reserved
        // choices. Shared initials therefore cannot produce an automatic mapping.
        const unique =
            candidate &&
            candidates.filter((label) => label === candidate).length === 1;
        // Preserve existing exact matches even if duplicated; only new suggestions
        // require uniqueness. Leave unresolved mappings blank for the user to choose.
        const designation = speakerOptions.includes(
            contribution.speaker_designation
        )
            ? contribution.speaker_designation
            : unique
              ? candidate
              : '';
        return { ...contribution, speaker_designation: designation };
    });
}
