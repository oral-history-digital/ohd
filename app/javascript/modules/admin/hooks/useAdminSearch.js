import { useCallback } from 'react';

import { fetchData as fetchDataAction } from 'modules/data';
import {
    resetQuery as resetQueryAction,
    setQueryParams as setQueryParamsAction,
} from 'modules/search';
import { hideSidebar as hideSidebarAction } from 'modules/sidebar';
import { useDispatch, useSelector } from 'react-redux';

export default function useAdminSearch(querySelector) {
    const dispatch = useDispatch();
    const query = useSelector(querySelector);

    const fetchData = useCallback(
        (...args) => dispatch(fetchDataAction(...args)),
        [dispatch]
    );
    const setQueryParams = useCallback(
        (...args) => dispatch(setQueryParamsAction(...args)),
        [dispatch]
    );
    const resetQuery = useCallback(
        (...args) => dispatch(resetQueryAction(...args)),
        [dispatch]
    );
    const hideSidebar = useCallback(
        () => dispatch(hideSidebarAction()),
        [dispatch]
    );

    return {
        query,
        fetchData,
        setQueryParams,
        resetQuery,
        hideSidebar,
    };
}
