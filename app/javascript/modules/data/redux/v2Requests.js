import Loader from 'modules/api/Loader';

import { RECEIVE_DATA, RECEIVE_ERROR, REQUEST_DATA } from './action-types';

const pendingByStore = new WeakMap();

/**
 * Describes the signed-in account and its access settings for cache matching.
 * Excludes credentials and personal details; the API still checks permissions.
 *
 * @param {Object} state - Root Redux state.
 * @returns {string} Serialized account, session, role, and project-access values.
 */
export function v2AccessContext(state) {
    const user = state.data.users?.current;
    return JSON.stringify([
        Boolean(state.user?.isLoggedIn),
        state.user?.loggedInAt || null,
        user?.id ?? null,
        user?.admin || false,
        Object.values(user?.user_roles || {}).map(
            ({ id, project_id, role_id }) => [id, project_id, role_id]
        ),
        Object.values(user?.permissions || {}).map(({ klass, action_name }) => [
            klass,
            action_name,
        ]),
        Object.values(user?.user_projects || {}).map(
            ({ project_id, workflow_state }) => [project_id, workflow_state]
        ),
    ]);
}

/**
 * Identifies a read request within an account and cache generation.
 *
 * @param {string} url - Request URL with normalized query parameters.
 * @param {string} context - Serialized access settings from v2AccessContext.
 * @param {number} generation - Counter increased when cached data is invalidated.
 * @returns {string} Key used for the query result, request status, and pending promise.
 */
export function v2RequestKey(url, context, generation) {
    return JSON.stringify([url, context, generation]);
}

/**
 * @typedef {Object} V2ReadResult
 * @property {?Object} response - API response envelope, or null for a skipped request.
 * @property {?{status: ?number, message: string}} error - Failure, or null on success.
 */

/**
 * Fetches API data and dispatches its records and request status to Redux.
 * Concurrent callers in the same store share a promise. Completed requests are
 * reused unless refreshed; responses invalidated by access changes or mutations
 * are discarded. Failures resolve with an error rather than rejecting.
 *
 * @param {string} resource - Entity name handled by a v2 reducer, such as projects.
 * @param {string} url - Request URL with normalized query parameters.
 * @param {Object} [options={}] - Response locale and refresh settings.
 * @param {string} options.locale - Requested locale used to store display values.
 * @param {boolean} [options.refresh=false] - Refetch completed data; still shares pending requests.
 * @param {boolean} [options.single=false] - Expect one record instead of a paginated list.
 * @param {string} [options.projectResource] - Legacy project-owned list using this request flow.
 * @param {number} [options.projectId] - Expected owner of that resource list.
 * @returns {function(Function, Function): Promise<V2ReadResult>} Redux thunk. Cached
 * or obsolete requests resolve with both response and error set to null.
 */
export function fetchV2Data(
    resource,
    url,
    { locale, refresh = false, single = false, projectResource, projectId } = {}
) {
    return (dispatch, getState) => {
        const state = getState();
        const context = v2AccessContext(state);
        const generation = state.data.v2?.[resource]?.generation || 0;
        const key = v2RequestKey(url, context, generation);
        let pending = pendingByStore.get(getState);
        if (!pending) {
            pending = new Map();
            pendingByStore.set(getState, pending);
        }
        if (pending.has(key)) return pending.get(key);
        const previous = state.data.v2?.[resource];
        if (
            !refresh &&
            previous?.context === context &&
            previous.requests[key]?.status === 'succeeded'
        )
            return Promise.resolve({ response: null, error: null });

        let resolve;
        const promise = new Promise((done) => {
            resolve = done;
        });
        pending.set(key, promise);
        const query = new URLSearchParams(url.split('?')[1]);
        const profile = query.get('profile') || 'display';
        const include =
            query
                .get('include')
                ?.split(',')
                .map((name) => name.trim()) || [];
        const metadata = {
            apiVersion: 2,
            dataType: resource,
            url,
            key,
            context,
            generation,
            locale,
            single,
            profile,
            include,
            ...(projectResource ? { projectResource, projectId } : {}),
        };
        dispatch({ ...metadata, type: REQUEST_DATA });
        /**
         * Settles the shared promise and builds the action for the reducer.
         *
         * @param {string} type - Success or failure action type.
         * @param {V2ReadResult} result - Response or structured error.
         * @returns {Object} Redux action; obsolete payloads are removed.
         */
        const finish = (type, result) => {
            pending.delete(key);
            const current = getState();
            const obsolete =
                v2AccessContext(current) !== context ||
                (current.data.v2?.[resource]?.generation || 0) !== generation;
            if (obsolete) result = { response: null, error: null };
            resolve(result);
            return {
                ...metadata,
                type,
                data: result.response,
                error: result.error,
            };
        };
        /**
         * Converts transport or validation failures into a settled request.
         *
         * @param {Error|Object} error - Error from Loader or response validation.
         * @returns {Object} Failure action containing a status and message.
         */
        const fail = (error) =>
            finish(RECEIVE_ERROR, {
                response: null,
                error: {
                    status: error.status || error.response?.status || null,
                    message: error.message || 'Unable to load data.',
                },
            });
        try {
            Loader.getJson(
                url,
                null,
                dispatch,
                (response) => {
                    if (projectResource) {
                        // TODO: Remove envelope adaptation when these resources have
                        // standardized endpoints. They already share project request safety.
                        const matchesOwner =
                            response?.data_type === 'projects' &&
                            response.nested_data_type === projectResource &&
                            Number(response.id) === projectId;
                        const rootNameTypes =
                            projectResource === 'registry_name_types' &&
                            response?.data_type === projectResource &&
                            response.extra_params ===
                                `for_projects_${projectId}`;
                        if (
                            !(matchesOwner || rootNameTypes) ||
                            !response.data ||
                            Array.isArray(response.data) ||
                            typeof response.data !== 'object' ||
                            !Object.values(response.data).every(
                                (record) =>
                                    Number.isInteger(record?.id) &&
                                    record.id > 0
                            )
                        )
                            return fail({
                                message: 'Invalid project resource response.',
                            });
                        return finish(RECEIVE_DATA, { response, error: null });
                    }
                    const records = single ? [response?.data] : response?.data;
                    if (
                        !Array.isArray(records) ||
                        !records.every(
                            (record) =>
                                Number.isInteger(record?.id) && record.id > 0
                        ) ||
                        (!single &&
                            (!response.pagination ||
                                ![
                                    'page',
                                    'per_page',
                                    'total_pages',
                                    'total_count',
                                ].every((field) =>
                                    Number.isInteger(response.pagination[field])
                                )))
                    )
                        return fail({
                            message: single
                                ? 'Invalid record response.'
                                : 'Invalid list response.',
                        });
                    return finish(RECEIVE_DATA, { response, error: null });
                },
                fail
            );
        } catch (error) {
            dispatch(fail(error));
        }
        return promise;
    };
}
