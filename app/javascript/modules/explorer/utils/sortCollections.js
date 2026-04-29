import { normalizeNameForSort } from 'modules/utils';

export const COLLECTION_SORT_OPTIONS = [
    { value: 'name_asc', labelKey: 'explorer.sort.collection_name_asc' },
    { value: 'name_desc', labelKey: 'explorer.sort.collection_name_desc' },
    {
        value: 'interviews_desc',
        labelKey: 'explorer.sort.collection_interviews_desc',
    },
    {
        value: 'interviews_asc',
        labelKey: 'explorer.sort.collection_interviews_asc',
    },
];

export const DEFAULT_COLLECTION_SORT = 'name_asc';

const collectionInterviewCount = (collection) => {
    const total = collection.interviews?.total ?? 0;
    const unshared = collection.interviews?.unshared ?? 0;
    return total - unshared;
};

export const sortCollections = (collections, sort) => {
    const [field, dir] = (sort || DEFAULT_COLLECTION_SORT).split('_');
    const asc = dir === 'asc';

    return [...collections].sort((a, b) => {
        if (field === 'name') {
            const aName = (a.name || '').toLowerCase();
            const bName = (b.name || '').toLowerCase();
            const av = normalizeNameForSort(aName);
            const bv = normalizeNameForSort(bName);

            const normalizedComparison = av.localeCompare(bv);
            if (normalizedComparison !== 0) {
                return asc ? normalizedComparison : -normalizedComparison;
            }

            const originalComparison = aName.localeCompare(bName);
            return asc ? originalComparison : -originalComparison;
        }

        const av = collectionInterviewCount(a);
        const bv = collectionInterviewCount(b);
        return asc ? av - bv : bv - av;
    });
};
