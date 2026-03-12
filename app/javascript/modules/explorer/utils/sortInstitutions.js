export const INST_SORT_OPTIONS = [
    { value: 'name_asc', label: 'Name (A–Z)' },
    { value: 'name_desc', label: 'Name (Z–A)' },
    { value: 'archives_asc', label: 'Archives (Ascending)' },
    { value: 'archives_desc', label: 'Archives (Descending)' },
    { value: 'collections_asc', label: 'Collections (Ascending)' },
    { value: 'collections_desc', label: 'Collections (Descending)' },
    { value: 'interviews_asc', label: 'Interviews (Ascending)' },
    { value: 'interviews_desc', label: 'Interviews (Descending)' },
];

export const DEFAULT_INST_SORT = 'name_asc';

export const sortInstitutions = (institutions, sort) => {
    const [field, dir] = (sort || DEFAULT_INST_SORT).split('_');
    const asc = dir === 'asc';

    return [...institutions].sort((a, b) => {
        if (field === 'name') {
            const av = (a.name || '').toLowerCase();
            const bv = (b.name || '').toLowerCase();
            return asc ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        let av, bv;
        if (field === 'archives') {
            av = a.archives?.length ?? 0;
            bv = b.archives?.length ?? 0;
        } else if (field === 'collections') {
            av = a.collections?.total ?? 0;
            bv = b.collections?.total ?? 0;
        } else {
            // interviews
            av = a.interviews?.total ?? 0;
            bv = b.interviews?.total ?? 0;
        }
        return asc ? av - bv : bv - av;
    });
};
