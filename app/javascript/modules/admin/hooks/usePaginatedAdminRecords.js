import { useCallback, useEffect, useRef } from 'react';

import { pluralize } from 'modules/strings';

import parametrizedQuery from '../parametrizedQuery';
import statifiedQuery from '../statifiedQuery';

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
    locale,
    project,
    projectId,
}) {
    // Capture initial values because legacy loading runs only once on mount.
    const initialConfig = useRef({
        query,
        dataStatus,
        statuses,
        otherDataToLoad,
        scope,
        scopeId,
        nestedScope,
        fetchData,
        locale,
        project,
        projectId,
    });

    useEffect(() => {
        const config = initialConfig.current;
        const context = {
            locale: config.locale,
            project: config.project,
            projectId: config.projectId,
        };

        if (
            config.query &&
            !(
                config.dataStatus?.[`for_projects_${config.project?.id}`] ||
                config.dataStatus?.all ||
                config.dataStatus?.[statifiedQuery(config.query)]
            )
        ) {
            config.fetchData(
                context,
                pluralize(config.scope),
                config.scopeId || null,
                config.nestedScope ? pluralize(config.nestedScope) : null,
                parametrizedQuery(config.query)
            );
        }

        config.otherDataToLoad.forEach((dataType) => {
            if (!config.statuses?.[dataType]?.all) {
                config.fetchData(
                    context,
                    pluralize(dataType),
                    null,
                    null,
                    'all'
                );
            }
        });
    }, []);

    const loadNextPage = useCallback(
        (inView) => {
            if (!inView) {
                return;
            }

            setQueryParams(pluralize(nestedScope || scope), {
                page: query.page + 1,
            });
            fetchData(
                { locale, project, projectId },
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        },
        [
            fetchData,
            locale,
            nestedScope,
            project,
            projectId,
            query,
            scope,
            scopeId,
            setQueryParams,
        ]
    );

    const notFetched = !(
        /^fetched/.test(dataStatus?.[`for_projects_${project?.id}`]) ||
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
