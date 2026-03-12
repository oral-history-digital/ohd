export const INST_SORT_OPTIONS = [
    { value: 'name_asc', labelKey: 'explorer.sort.name_asc' },
    { value: 'name_desc', labelKey: 'explorer.sort.name_desc' },
    { value: 'archives_asc', labelKey: 'explorer.sort.archives_asc' },
    { value: 'archives_desc', labelKey: 'explorer.sort.archives_desc' },
    { value: 'collections_asc', labelKey: 'explorer.sort.collections_asc' },
    { value: 'collections_desc', labelKey: 'explorer.sort.collections_desc' },
    { value: 'interviews_asc', labelKey: 'explorer.sort.interviews_asc' },
    { value: 'interviews_desc', labelKey: 'explorer.sort.interviews_desc' },
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
