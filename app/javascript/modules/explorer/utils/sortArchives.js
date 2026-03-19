import { normalizeNameForSort } from 'modules/utils';

export const SORT_OPTIONS = [
    { value: 'name_asc', labelKey: 'explorer.sort.name_asc' },
    { value: 'name_desc', labelKey: 'explorer.sort.name_desc' },
    { value: 'interviews_desc', labelKey: 'explorer.sort.interviews_desc' },
    { value: 'interviews_asc', labelKey: 'explorer.sort.interviews_asc' },
];

export const DEFAULT_SORT = 'name_asc';

export const sortArchives = (archives, sort) => {
    const [field, dir] = (sort || DEFAULT_SORT).split('_');
    const asc = dir === 'asc';

    return [...archives].sort((a, b) => {
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
            av = a.interviews?.total ?? 0;
            bv = b.interviews?.total ?? 0;
        } else {
            av = a.collections?.total ?? 0;
            bv = b.collections?.total ?? 0;
        }
        return asc ? av - bv : bv - av;
    });
};
