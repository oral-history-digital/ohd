/**
 * Filters archives by text query and/or interview count range.
 *
 * @param {Array}       archives
 * @param {string}      query        - Text to match against name / institutions
 * @param {number|null} interviewMin - Inclusive minimum interview count (null = no limit)
 * @param {number|null} interviewMax - Inclusive maximum interview count (null = no limit)
 * @returns {Array} Filtered archives
 */
export const filterArchives = (archives, query, interviewMin, interviewMax) =>
    archives.filter((a) => {
        if (query) {
            const lower = query.toLowerCase();
            const matchesText =
                (a.display_name || a.name)?.toLowerCase().includes(lower) ||
                a.institutions?.some((i) =>
                    i.name?.toLowerCase().includes(lower)
                );
            if (!matchesText) return false;
        }

        if (interviewMin !== null || interviewMax !== null) {
            const total = a.interviews?.total ?? 0;
            if (interviewMin !== null && total < interviewMin) return false;
            if (interviewMax !== null && total > interviewMax) return false;
        }

        return true;
    });
