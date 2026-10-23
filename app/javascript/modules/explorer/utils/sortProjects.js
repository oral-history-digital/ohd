import { normalizeNameForSort } from 'modules/utils';

export const SORT_OPTIONS = [
    { value: 'name_asc', labelKey: 'explorer.sort.name_asc' },
    { value: 'name_desc', labelKey: 'explorer.sort.name_desc' },
    { value: 'interviews_desc', labelKey: 'explorer.sort.interviews_desc' },
    { value: 'interviews_asc', labelKey: 'explorer.sort.interviews_asc' },
];

export const DEFAULT_SORT = 'name_asc';

/**
 * Sorts project summaries by display name or count without changing the input.
 * Missing counts are treated as zero; names ignore leading punctuation.
 *
 * @param {Object[]} projects - Project summaries.
 * @param {string} [sort='name_asc'] - Existing catalog sort value, such as interviews_desc.
 * @returns {Object[]} Sorted copy of the list.
 */
export const sortProjects = (projects, sort) => {
    const [field, dir] = (sort || DEFAULT_SORT).split('_');
    const asc = dir === 'asc';

    return [...projects].sort((a, b) => {
        let av, bv;
        if (field === 'name') {
            const aName = (a.display_name || a.name || '').toLowerCase();
            const bName = (b.display_name || b.name || '').toLowerCase();
            av = normalizeNameForSort(aName);
            bv = normalizeNameForSort(bName);

            const normalizedComparison = av.localeCompare(bv);
            if (normalizedComparison !== 0) {
                return asc ? normalizedComparison : -normalizedComparison;
            }

            // Fallback keeps ordering deterministic when normalized names match.
            const originalComparison = aName.localeCompare(bName);
            return asc ? originalComparison : -originalComparison;
        }
        if (field === 'interviews') {
            av = a.interview_counts?.total ?? 0;
            bv = b.interview_counts?.total ?? 0;
        } else {
            av = a.collection_counts?.total ?? 0;
            bv = b.collection_counts?.total ?? 0;
        }
        return asc ? av - bv : bv - av;
    });
};
