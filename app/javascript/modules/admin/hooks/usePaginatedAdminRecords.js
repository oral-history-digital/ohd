import { useCallback, useEffect, useRef } from 'react';

import { pluralize } from 'modules/strings';

import { parametrizedQuery, statifiedQuery } from '../utils';

/**
 * Loads initial admin resources once per project route and fetches further pages on demand.
 * @param {Object} options - Query/status state, route, project ID, and Redux request actions.
 * @returns {Object} Loading/pagination flags and the next-page callback.
 */
export default function usePaginatedAdminRecords({
    query,
    dataStatus,
    statuses,
    otherDataToLoad,
    resultPagesCount,
    scope,
    scopeId,
    nestedScope,
    fetchData,
    setQueryParams,
    pathBase,
    projectDbId,
}) {
    const initializedFor = useRef(null);

    useEffect(() => {
        const routeKey = `${pathBase}/${projectDbId}`;
        if (!projectDbId || initializedFor.current === routeKey) return;
        initializedFor.current = routeKey;
        const context = { pathBase };
        if (
            query &&
            !(
                dataStatus?.[`for_projects_${projectDbId}`] ||
                dataStatus?.all ||
                dataStatus?.[statifiedQuery(query)]
            )
        ) {
            fetchData(
                context,
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        }
        otherDataToLoad.forEach((dataType) => {
            if (!statuses?.[dataType]?.all)
                fetchData(context, pluralize(dataType), null, null, 'all');
        });
    }, [
        pathBase,
        projectDbId,
        dataStatus,
        fetchData,
        nestedScope,
        otherDataToLoad,
        query,
        scope,
        scopeId,
        statuses,
    ]);

    const loadNextPage = useCallback(
        (inView) => {
            if (!inView) {
                return;
            }

            setQueryParams(pluralize(nestedScope || scope), {
                page: query.page + 1,
            });
            fetchData(
                { pathBase },
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        },
        [
            fetchData,
            pathBase,
            nestedScope,
            query,
            scope,
            scopeId,
            setQueryParams,
        ]
    );

    const notFetched = !(
        /^fetched/.test(dataStatus?.[`for_projects_${projectDbId}`]) ||
        /^fetched/.test(dataStatus?.all)
    );
    const queryStatusKey = query ? statifiedQuery(query) : null;
    const isFetching =
        queryStatusKey &&
        dataStatus?.[queryStatusKey]?.split('-')[0] === 'fetching';
    const currentPage = query?.page ? parseInt(query.page, 10) : 1;

    return {
        hasMorePages: !resultPagesCount || resultPagesCount > currentPage,
        isFetching,
        loadNextPage,
        shouldShowPagination: Boolean(query && notFetched),
    };
}
