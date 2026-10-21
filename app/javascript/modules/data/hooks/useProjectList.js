import { useCallback, useEffect, useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

import { makeProjectListSelector, projectListUrl } from '../redux/projectLists';
import {
    fetchProjectData,
    projectAccessContext,
} from '../redux/projectRequests';

/**
 * @typedef {import('../redux/projectLists').ProjectListOptions} ProjectListOptions
 * @typedef {import('../redux/projectLists').ProjectListSelection} ProjectListSelection
 * @typedef {import('../redux/projectRequests').ProjectReadResult} ProjectReadResult
 * @typedef {ProjectListSelection & {mutate: function(): Promise<ProjectReadResult>}} ProjectListResult
 */

/**
 * Fetches a project list from the API and reads its data and request status from Redux.
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
    const context = useSelector(projectAccessContext);

    // Access changes and mutations advance the generation; stale lists refresh in place.
    const generation = useSelector(
        (state) => state.data.projects?.generation || 0
    );
    useEffect(() => {
        if (enabled && (!result.status || result.status === 'stale'))
            dispatch(fetchProjectData('projects', url, { locale }));
    }, [dispatch, url, locale, context, generation, result.status, enabled]);
    const mutate = useCallback(
        () =>
            dispatch(
                fetchProjectData('projects', url, { locale, refresh: true })
            ),
        [dispatch, url, locale]
    );
    return {
        ...result,
        isLoading: enabled && result.isLoading,
        isValidating: enabled && result.isValidating,
        mutate,
    };
}
