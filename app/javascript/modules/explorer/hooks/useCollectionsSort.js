import { useSearchParams } from 'react-router-dom';

import { DEFAULT_COLLECTION_SORT } from '../utils';

export function useCollectionsSort() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort =
        searchParams.get('explorer_collection_sort') || DEFAULT_COLLECTION_SORT;

    const setSort = (value) =>
        setSearchParams(
            (prev) => {
                if (value === DEFAULT_COLLECTION_SORT) {
                    prev.delete('explorer_collection_sort');
                } else {
                    prev.set('explorer_collection_sort', value);
                }
                return prev;
            },
            { replace: true }
        );

    return { sort, setSort };
}
