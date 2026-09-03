import { useCallback } from 'react';

import { fetchData as fetchDataAction } from 'modules/data';
import {
    getCollectionsQuery,
    resetQuery as resetQueryAction,
    setQueryParams as setQueryParamsAction,
} from 'modules/search';
import { hideSidebar as hideSidebarAction } from 'modules/sidebar';
import { useDispatch, useSelector } from 'react-redux';

import DataSearchForm from './DataSearchForm';

export default function CollectionsSearchForm() {
    const dispatch = useDispatch();
    const query = useSelector(getCollectionsQuery);

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

    return (
        <DataSearchForm
            query={query}
            scope="collection"
            searchableAttributes={[{ attributeName: 'name' }]}
            fetchData={fetchData}
            setQueryParams={setQueryParams}
            resetQuery={resetQuery}
            hideSidebar={hideSidebar}
        />
    );
}
