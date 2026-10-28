import { createSelector } from 'reselect';

import { readProjectRecord } from './projectRecords';
import { v2AccessContext, v2RequestKey } from './v2Requests';

/**
 * @typedef {Object} ProjectDetailOptions
 * @property {string} [locale] - Requested language; defaults to the UI locale.
 * @property {'display'|'edit'} [profile='display'] - Display values or authorized editing data.
 * @property {string[]} [include=[]] - Optional fields to fetch for this profile.
 */

/**
 * @typedef {Object} ProjectDetailSelection
 * @property {Object|undefined} project - Project values for the requested locale, profile, and includes.
 * @property {string|undefined} status - Pending, succeeded, or failed; absent before fetching.
 * @property {?{status: ?number, message: string}} error - Request failure, if any.
 * @property {boolean} isLoading - No detail response is available and the request has not failed.
 * @property {boolean} isValidating - A request is pending, including during refresh.
 */

/**
 * Builds a detail URL with normalized includes, an explicit locale, and optional edit profile.
 *
 * @param {number|string|null|undefined} identifier - Project ID or shortname; empty skips fetching.
 * @param {string} locale - Requested display locale.
 * @param {ProjectDetailOptions} [options={}] - Profile and optional fields.
 * @returns {string|null} Request URL, or null when no identifier is provided.
 */
export function projectDetailUrl(
    identifier,
    locale,
    { profile = 'display', include = [] } = {}
) {
    if (identifier === null || identifier === undefined || identifier === '')
        return null;
    const query = new URLSearchParams({ locale });
    if (profile !== 'display') query.set('profile', profile);
    if (include.length)
        query.set(
            'include',
            [...new Set(include.map((name) => name.trim()))].sort().join(',')
        );
    query.sort();
    return `/api/v2/projects/${encodeURIComponent(identifier)}?${query}`;
}

/**
 * Selects routing identities, preferring current Redux records over bootstrap data.
 * Bootstrap remains available while details load; neither localized nor protected fields are returned.
 *
 * @param {Object} state - Root Redux state.
 * @returns {Object<number, Object>} IDs, shortnames, domains, and umbrella flags by project ID.
 */
export const getProjectIdentities = createSelector(
    [
        (state) => state.data.projects,
        (state) => state.data.v2?.projects,
        v2AccessContext,
    ],
    (bootstrap, projects, context) => {
        const records = projects?.context === context ? projects.records : {};
        return Object.fromEntries(
            Object.values({ ...bootstrap, ...records }).map(
                ({ id, shortname, archive_domain, is_umbrella }) => [
                    id,
                    { id, shortname, archive_domain, is_umbrella },
                ]
            )
        );
    }
);

/**
 * Creates a selector that reads a cached project without fetching it.
 * Returns no project until display values exist for the requested locale and access context.
 *
 * @returns {function(Object, number|string|null, string): (Object|undefined)} Selector
 * accepting root state, project ID, and display locale.
 */
export const makeProjectSelector = () =>
    createSelector(
        [
            (state) => state.data.v2?.projects,
            v2AccessContext,
            (_state, id) => id,
            (_state, _id, locale) => locale,
        ],
        (projects, context, id, locale) =>
            projects?.context === context
                ? readProjectRecord(projects, id, locale)
                : undefined
    );

/**
 * Creates a selector for details confirmed by this locale/profile/include query.
 * Keeps details visible during refresh but hides failed or obsolete-access results.
 *
 * @returns {function(Object, ?string, string): ProjectDetailSelection} Selector accepting
 * root state, request URL, and requested locale.
 */
export const makeProjectDetailSelector = () =>
    createSelector(
        [
            (state) => state.data.v2?.projects,
            v2AccessContext,
            (_state, url) => url,
            (_state, _url, locale) => locale,
        ],
        (projects, context, url, locale) => {
            const key = v2RequestKey(url, context, projects?.generation || 0);
            const request =
                url && projects?.context === context
                    ? projects.requests[key]
                    : null;
            return {
                project: request?.id
                    ? readProjectRecord(
                          projects,
                          request.id,
                          locale,
                          request.profile,
                          request.include
                      )
                    : undefined,
                status: request?.status,
                error: request?.error || null,
                isLoading:
                    Boolean(url) &&
                    !request?.id &&
                    request?.status !== 'failed',
                isValidating: request?.status === 'pending',
            };
        }
    );
