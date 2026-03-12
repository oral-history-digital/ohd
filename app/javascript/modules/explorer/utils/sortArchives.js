export const SORT_OPTIONS = [
    { value: 'interviews_asc', labelKey: 'explorer.sort.interviews_asc' },
    { value: 'interviews_desc', labelKey: 'explorer.sort.interviews_desc' },
    { value: 'collections_asc', labelKey: 'explorer.sort.collections_asc' },
    { value: 'collections_desc', labelKey: 'explorer.sort.collections_desc' },
    { value: 'name_asc', labelKey: 'explorer.sort.name_asc' },
    { value: 'name_desc', labelKey: 'explorer.sort.name_desc' },
];

export const DEFAULT_SORT = 'interviews_asc';

export const sortArchives = (archives, sort) => {
    const [field, dir] = (sort || DEFAULT_SORT).split('_');
    const asc = dir === 'asc';

    return [...archives].sort((a, b) => {
        let av, bv;
        if (field === 'name') {
            av = (a.display_name || a.name || '').toLowerCase();
            bv = (b.display_name || b.name || '').toLowerCase();
            return asc ? av.localeCompare(bv) : bv.localeCompare(av);
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
