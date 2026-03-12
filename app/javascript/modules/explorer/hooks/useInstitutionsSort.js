import { useSearchParams } from 'react-router-dom';

import { DEFAULT_INST_SORT } from '../utils';

export function useInstitutionsSort() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get('explorer_inst_sort') || DEFAULT_INST_SORT;

    const setSort = (value) =>
        setSearchParams(
            (prev) => {
                if (value === DEFAULT_INST_SORT) {
                    prev.delete('explorer_inst_sort');
                } else {
                    prev.set('explorer_inst_sort', value);
                }
                return prev;
            },
            { replace: true }
        );

    return { sort, setSort };
}
