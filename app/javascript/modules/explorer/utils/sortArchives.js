export const SORT_OPTIONS = [
    { value: 'interviews_asc', label: 'Interviews (Ascending)' },
    { value: 'interviews_desc', label: 'Interviews (Descending)' },
    { value: 'collections_asc', label: 'Collections (Ascending)' },
    { value: 'collections_desc', label: 'Collections (Descending)' },
    { value: 'name_asc', label: 'Name (A–Z)' },
    { value: 'name_desc', label: 'Name (Z–A)' },
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
