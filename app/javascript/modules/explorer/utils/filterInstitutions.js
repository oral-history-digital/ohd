/**
 * Filters institutions by text query and/or interview count range.
 *
 * @param {Array}       institutions
 * @param {string}      query        - Text to match against name / description / archive names
 * @param {number|null} interviewMin - Inclusive minimum interview count (null = no limit)
 * @param {number|null} interviewMax - Inclusive maximum interview count (null = no limit)
 * @returns {Array} Filtered institutions
 */
export const filterInstitutions = (
    institutions,
    query,
    interviewMin,
    interviewMax,
    instArchiveMin,
    instArchiveMax
) =>
    institutions.filter((i) => {
        if (query) {
            const lower = query.toLowerCase();
            const matchesQuery =
                i.name?.toLowerCase().includes(lower) ||
                i.description?.toLowerCase().includes(lower) ||
                i.archives?.some((a) => a.name?.toLowerCase().includes(lower));
            if (!matchesQuery) return false;
        }

        if (interviewMin !== null || interviewMax !== null) {
            const total = i.interviews?.total ?? 0;
            if (interviewMin !== null && total < interviewMin) return false;
            if (interviewMax !== null && total > interviewMax) return false;
        }

        if (instArchiveMin !== null || instArchiveMax !== null) {
            const count = i.archives?.length ?? 0;
            if (instArchiveMin !== null && count < instArchiveMin) return false;
            if (instArchiveMax !== null && count > instArchiveMax) return false;
        }

        return true;
    });
