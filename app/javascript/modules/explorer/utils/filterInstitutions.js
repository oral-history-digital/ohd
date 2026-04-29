/**
 * Filters institutions by text query and/or interview count range.
 *
 * @param {Array} institutions
 * @param {Object} filters
 * @param {string|null} filters.query - Text to match against name / description / project names
 * @param {number|null} filters.interviewMin - Inclusive minimum interview count (null = no limit)
 * @param {number|null} filters.interviewMax - Inclusive maximum interview count (null = no limit)
 * @param {number|null} filters.instProjectMin - Inclusive minimum project count (null = no limit)
 * @param {number|null} filters.instProjectMax - Inclusive maximum project count (null = no limit)
 * @param {string|null} filters.institutionLevel - 'all' to include all institutions, 'top_level' to include only those without a parent
 * @returns {Array} Filtered institutions
 */
export const filterInstitutions = (
    institutions,
    {
        query = null,
        interviewMin = null,
        interviewMax = null,
        instProjectMin = null,
        instProjectMax = null,
        institutionLevel = 'all',
    } = {}
) =>
    institutions.filter((i) => {
        if (!i) {
            return false;
        }

        if (institutionLevel === 'top_level' && i.parent?.id) {
            return false;
        }

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

        if (instProjectMin !== null || instProjectMax !== null) {
            const count = i.archives?.length ?? 0;
            if (instProjectMin !== null && count < instProjectMin) return false;
            if (instProjectMax !== null && count > instProjectMax) return false;
        }

        return true;
    });
