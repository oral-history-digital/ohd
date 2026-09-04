import { useCallback } from 'react';

import {
    deleteData as deleteDataAction,
    fetchData as fetchDataAction,
    submitData as submitDataAction,
} from 'modules/data';
import { setQueryParams as setQueryParamsAction } from 'modules/search';
import { useDispatch } from 'react-redux';

export default function useAdminDataActions() {
    const dispatch = useDispatch();

    const fetchData = useCallback(
        (...args) => dispatch(fetchDataAction(...args)),
        [dispatch]
    );
    const deleteData = useCallback(
        (...args) => dispatch(deleteDataAction(...args)),
        [dispatch]
    );
    const submitData = useCallback(
        (...args) => dispatch(submitDataAction(...args)),
        [dispatch]
    );
    const setQueryParams = useCallback(
        (...args) => dispatch(setQueryParamsAction(...args)),
        [dispatch]
    );

    return { fetchData, deleteData, submitData, setQueryParams };
}
