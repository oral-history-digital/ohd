import { useCallback, useEffect, useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

import { makeProjectListSelector, projectListUrl } from '../redux/projectLists';
import { fetchV2List, v2AccessContext } from '../redux/v2Requests';

/**
 * @typedef {import('../redux/projectLists').ProjectListOptions} ProjectListOptions
 * @typedef {import('../redux/projectLists').ProjectListSelection} ProjectListSelection
 * @typedef {import('../redux/v2Requests').V2ListResult} V2ListResult
 * @typedef {ProjectListSelection & {mutate: function(): Promise<V2ListResult>}} ProjectListResult
 */

/**
 * Fetches a project list from API v2 and reads its data and request status from Redux.
 * The sidebar calls this hook on every page. It passes enabled: false outside
 * catalog filter views so hidden filters do not trigger API requests.
 * Access changes and mutations invalidate cached lists and trigger refetching.
 *
 * @param {ProjectListOptions} [options={}] - Query and fetching options.
 * @returns {ProjectListResult}
 * List data and status, plus mutate() to request fresh data explicitly, even when
 * enabled is false. Refreshing keeps the previous list visible while fetching.
 */
export function useProjectList(options = {}) {
    const { enabled = true } = options;
    const { locale } = useI18n();
    const dispatch = useDispatch();
    const url = projectListUrl(locale, options);
    const select = useMemo(makeProjectListSelector, []);
    const result = useSelector((state) => select(state, url, locale));
    const context = useSelector(v2AccessContext);

    // Changes after access updates or mutations, so invalidated lists are fetched again.
    const generation = useSelector(
        (state) => state.data.v2?.projects?.generation || 0
    );
    useEffect(() => {
        if (enabled && !result.status)
            dispatch(fetchV2List('projects', url, { locale }));
    }, [dispatch, url, locale, context, generation, result.status, enabled]);
    const mutate = useCallback(
        () => dispatch(fetchV2List('projects', url, { locale, refresh: true })),
        [dispatch, url, locale]
    );
    return {
        ...result,
        isLoading: enabled && result.isLoading,
        isValidating: enabled && result.isValidating,
        mutate,
    };
}
