import { useSearchParams } from 'react-router-dom';

import { DEFAULT_SORT } from '../utils';

export function useArchivesSort() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get('explorer_sort') || DEFAULT_SORT;

    const setSort = (value) =>
        setSearchParams(
            (prev) => {
                if (value === DEFAULT_SORT) {
                    prev.delete('explorer_sort');
                } else {
                    prev.set('explorer_sort', value);
                }
                return prev;
            },
            { replace: true }
        );

    return { sort, setSort };
}
