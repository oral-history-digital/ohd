import { useCallback, useEffect, useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

import {
    makeProjectDetailSelector,
    projectDetailUrl,
} from '../redux/projectDetails';
import {
    fetchProjectData,
    projectAccessContext,
} from '../redux/projectRequests';

/**
 * @typedef {import('../redux/projectDetails').ProjectDetailOptions} ProjectDetailOptions
 * @typedef {import('../redux/projectDetails').ProjectDetailSelection} ProjectDetailSelection
 * @typedef {import('../redux/projectRequests').ProjectReadResult} ProjectReadResult
 * @typedef {ProjectDetailSelection & {mutate: function(): Promise<ProjectReadResult>}} ProjectDetailResult
 */

/**
 * Fetches project details and reads the requested profile and status from Redux.
 * Ordinary saves keep loaded details visible while affected queries refresh; access
 * changes discard them. Locale/profile/include changes require
 * their own successful response; summaries alone do not count as loaded details.
 *
 * @param {number|string|null|undefined} identifier - Project ID or shortname; empty skips fetching.
 * @param {ProjectDetailOptions} [options={}] - Locale, profile, and optional fields to request.
 * @returns {ProjectDetailResult} Details and status, plus mutate() for an explicit refresh.
 */
export function useProjectDetail(identifier, options = {}) {
    const { locale: currentLocale } = useI18n();
    const locale = options.locale || currentLocale;
    const dispatch = useDispatch();
    const url = projectDetailUrl(identifier, locale, options);
    const select = useMemo(makeProjectDetailSelector, []);
    const result = useSelector((state) => select(state, url, locale));
    const context = useSelector(projectAccessContext);
    const generation = useSelector(
        (state) => state.data.projects?.generation || 0
    );
    useEffect(() => {
        if (url && (!result.status || result.status === 'stale'))
            dispatch(
                fetchProjectData('projects', url, { locale, single: true })
            );
    }, [dispatch, url, locale, context, generation, result.status]);
    const mutate = useCallback(
        () =>
            url
                ? dispatch(
                      fetchProjectData('projects', url, {
                          locale,
                          single: true,
                          refresh: true,
                      })
                  )
                : Promise.resolve({ response: null, error: null }),
        [dispatch, url, locale]
    );
    return { ...result, mutate };
}
