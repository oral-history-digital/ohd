import { normalizeNameForSort } from 'modules/utils';

export const INST_SORT_OPTIONS = [
    { value: 'name_asc', labelKey: 'explorer.sort.name_asc' },
    { value: 'name_desc', labelKey: 'explorer.sort.name_desc' },
    { value: 'interviews_desc', labelKey: 'explorer.sort.interviews_desc' },
    { value: 'interviews_asc', labelKey: 'explorer.sort.interviews_asc' },
];

export const DEFAULT_INST_SORT = 'name_asc';

export const sortInstitutions = (institutions, sort) => {
    const [field, dir] = (sort || DEFAULT_INST_SORT).split('_');
    const asc = dir === 'asc';

    return [...institutions].sort((a, b) => {
        if (field === 'name') {
            const aName = (a.name || '').toLowerCase();
            const bName = (b.name || '').toLowerCase();
            const aSortValue = normalizeNameForSort(aName);
            const bSortValue = normalizeNameForSort(bName);

            const normalizedComparison = aSortValue.localeCompare(bSortValue);
            if (normalizedComparison !== 0) {
                return asc ? normalizedComparison : -normalizedComparison;
            }

            const originalComparison = aName.localeCompare(bName);
            return asc ? originalComparison : -originalComparison;
        }

        let aSortValue, bSortValue;
        if (field === 'collections') {
            aSortValue = a.collections?.total ?? 0;
            bSortValue = b.collections?.total ?? 0;
        } else {
            aSortValue = a.interviews?.total ?? 0;
            bSortValue = b.interviews?.total ?? 0;
        }
        return asc ? aSortValue - bSortValue : bSortValue - aSortValue;
    });
};
