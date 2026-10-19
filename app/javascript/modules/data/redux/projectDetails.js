import { createSelector } from 'reselect';

import { v2AccessContext, v2RequestKey } from './v2Requests';

/**
 * @typedef {Object} ProjectDetailOptions
 * @property {string[]} [include=[]] - Optional display fields to fetch.
 */

/**
 * @typedef {Object} ProjectDetailSelection
 * @property {Object|undefined} project - Project with display values for the requested locale.
 * @property {string|undefined} status - Pending, succeeded, or failed; absent before fetching.
 * @property {?{status: ?number, message: string}} error - Request failure, if any.
 * @property {boolean} isLoading - No detail response is available and the request has not failed.
 * @property {boolean} isValidating - A request is pending, including during refresh.
 */

/**
 * Builds a display-detail URL with normalized includes and an explicit locale.
 *
 * @param {number|string|null|undefined} identifier - Project ID or shortname; empty skips fetching.
 * @param {string} locale - Requested display locale.
 * @param {ProjectDetailOptions} [options={}] - Optional display fields.
 * @returns {string|null} Request URL, or null when no identifier is provided.
 */
export function projectDetailUrl(identifier, locale, { include = [] } = {}) {
    if (identifier === null || identifier === undefined || identifier === '')
        return null;
    const query = new URLSearchParams({ locale });
    if (include.length)
        query.set('include', [...new Set(include)].sort().join(','));
    query.sort();
    return `/api/v2/projects/${encodeURIComponent(identifier)}?${query}`;
}

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
        (projects, context, id, locale) => {
            const record = projects?.records[id];
            const display = projects?.translations.display[id]?.[locale];
            if (projects?.context !== context || !record || !display)
                return undefined;
            return { ...record, ...display };
        }
    );

/**
 * Creates a selector for details confirmed by this query, rather than a cached summary.
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
                    ? {
                          ...projects.records[request.id],
                          ...projects.translations.display[request.id]?.[
                              locale
                          ],
                      }
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
