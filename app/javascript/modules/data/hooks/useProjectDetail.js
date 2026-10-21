import { useCallback, useEffect, useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

import {
    makeProjectDetailSelector,
    projectDetailUrl,
} from '../redux/projectDetails';
import { fetchV2Data, v2AccessContext } from '../redux/v2Requests';

/**
 * @typedef {import('../redux/projectDetails').ProjectDetailOptions} ProjectDetailOptions
 * @typedef {import('../redux/projectDetails').ProjectDetailSelection} ProjectDetailSelection
 * @typedef {import('../redux/v2Requests').V2ReadResult} V2ReadResult
 * @typedef {ProjectDetailSelection & {mutate: function(): Promise<V2ReadResult>}} ProjectDetailResult
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
    const context = useSelector(v2AccessContext);
    const generation = useSelector(
        (state) => state.data.v2?.projects?.generation || 0
    );
    useEffect(() => {
        if (url && (!result.status || result.status === 'stale'))
            dispatch(fetchV2Data('projects', url, { locale, single: true }));
    }, [dispatch, url, locale, context, generation, result.status]);
    const mutate = useCallback(
        () =>
            url
                ? dispatch(
                      fetchV2Data('projects', url, {
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
