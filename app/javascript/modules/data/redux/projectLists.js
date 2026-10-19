import { createSelector } from 'reselect';

import { v2AccessContext, v2ListKey } from './v2Requests';

/**
 * @typedef {Object} ProjectListOptions
 * @property {boolean} [all=false] - Fetch every matching project without pagination.
 * @property {number} [page=1] - Page to fetch when all is false.
 * @property {number} [perPage] - Page size; omitted to use the API default.
 * @property {string} [workflowState] - Comma-separated states; omitted to use policy scope alone.
 * @property {boolean} [includeUmbrella=false] - Include the configured umbrella project.
 * @property {string[]} [include=[]] - Optional fields requested from the API.
 * @property {string} [sort] - API sort field, prefixed with - for descending order.
 * @property {boolean} [enabled=true] - Hook option controlling automatic fetching; not sent to the API.
 */

/**
 * @typedef {Object} ProjectListSelection
 * @property {Object[]} projects - List records combined with their display values.
 * @property {Object|undefined} pagination - API pagination, available after success.
 * @property {string|undefined} status - Pending, succeeded, or failed; absent before a request.
 * @property {?{status: ?number, message: string}} error - Request failure, if any.
 * @property {boolean} isLoading - No list is available and the request has not failed.
 * @property {boolean} isValidating - A request is pending, including during refresh.
 */

/**
 * Builds the v2 project-list URL, sorting query parameters and deduplicating sets.
 * Pagination settings are omitted when all is true.
 *
 * @param {string} locale - Requested display locale.
 * @param {ProjectListOptions} [options={}] - Filters, includes, ordering, and pagination.
 * @returns {string} Relative API URL suitable for request-key construction.
 */
export function projectListUrl(
    locale,
    {
        all = false,
        page = 1,
        perPage,
        workflowState,
        includeUmbrella = false,
        include = [],
        sort,
    } = {}
) {
    const query = new URLSearchParams({ locale });
    query.set(all ? 'all' : 'page', all ? 'true' : String(page));
    if (!all && perPage) query.set('per_page', String(perPage));
    if (workflowState)
        query.set(
            'workflow_state',
            [...new Set(workflowState.split(',').map((value) => value.trim()))]
                .sort()
                .join(',')
        );
    if (includeUmbrella) query.set('include_umbrella', 'true');
    if (include.length)
        query.set('include', [...new Set(include)].sort().join(','));
    if (sort) query.set('sort', sort);
    query.sort();
    return `/api/v2/projects?${query}`;
}

/**
 * Creates a memoized selector for one hook's list and requested locale.
 * Reads IDs from the query result rather than returning every cached project.
 * Data from another access context is hidden until a matching request succeeds.
 *
 * @returns {function(Object, string, string): ProjectListSelection} Selector accepting
 * root Redux state, the normalized request URL, and the requested locale.
 */
export const makeProjectListSelector = () =>
    createSelector(
        [
            (state) => state.data.v2?.projects,
            v2AccessContext,
            (_state, url) => url,
            (_state, _url, locale) => locale,
        ],
        (projects, context, url, locale) => {
            const key = v2ListKey(url, context, projects?.generation || 0);
            const matchesContext = projects?.context === context;
            const list = matchesContext ? projects.lists[key] : null;
            const request = matchesContext ? projects.requests[key] : null;
            return {
                projects: (list?.ids || []).map((id) => ({
                    ...projects.records[id],
                    ...projects.translations.display[id]?.[locale],
                })),
                pagination: list?.pagination,
                status: request?.status,
                error: request?.error || null,
                isLoading: !list && request?.status !== 'failed',
                isValidating: request?.status === 'pending',
            };
        }
    );
