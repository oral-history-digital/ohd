import { Loader } from 'modules/api';
import { pathBase } from 'modules/routes';
import { pluralize } from 'modules/strings';

import {
    DELETE_STATUS_MSG,
    RECEIVE_DATA,
    RECEIVE_ERROR,
    REMOVE_DATA,
    REPLACE_INSTANCE_SETTINGS,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';
import { fetchProject } from './projectRequests';

function receiveError(dataType, id, error) {
    return {
        type: RECEIVE_ERROR,
        dataType,
        id,
        error,
    };
}

const updateData = (dataType, id, data, nestedDataType, nestedId) => ({
    type: UPDATE_DATA,
    id: id,
    dataType: dataType,
    data: data,
    nestedDataType: nestedDataType,
    nestedId: nestedId,
});

const removeData = (id, dataType, nestedDataType, nestedId) => ({
    type: REMOVE_DATA,
    id: id,
    dataType: dataType,
    nestedDataType: nestedDataType,
    nestedId: nestedId,
});

const requestData = (dataType, id, nestedDataType, extraParams) => ({
    type: REQUEST_DATA,
    id: id,
    dataType: dataType,
    nestedDataType: nestedDataType,
    extraParams: extraParams,
});

export const receiveData = (json) => ({
    type: RECEIVE_DATA,
    id: json.archive_id || json.id,
    data: json.data,
    dataType: json.data_type,
    nestedDataType: json.nested_data_type,
    nestedId: json.nested_id,
    extraParams: json.extra_params,
    extraId: json.extra_id,
    reloadDataType: json.reload_data_type,
    reloadId: json.reload_id,
    msg: json.msg,
    page: json.page,
    resultPagesCount: json.result_pages_count,
});

/**
 * Builds the usual receive action and marks it as a completed mutation so v2
 * caches can be invalidated without changing legacy response merging.
 *
 * @param {Object} json - Legacy mutation response envelope.
 * @returns {Object} Receive action with mutation set to true.
 */
export const receiveMutationData = (json) => ({
    ...receiveData(json),
    mutation: true,
});

export const replaceInstanceSettings = (data) => ({
    type: REPLACE_INSTANCE_SETTINGS,
    data,
});

/** Loads data. Single-project requests also share pending requests and track errors. */
export function fetchData(props, dataType, id, nestedDataType, extraParams) {
    // Share duplicate requests and track errors for single-project reads.
    // Apply these changes to projects first; keep other data loading unchanged.
    // TODO: Consider moving this logic into Loader.getJson() to share across all data types.
    if (dataType === 'projects' && id && !nestedDataType) {
        return fetchProject(props, id, extraParams, {
            requestData,
            receiveData,
            receiveError,
        });
    }

    let url = `${props.pathBase || pathBase(props)}/${dataType}`;
    if (id) {
        url += `/${id}`;
    }
    if (nestedDataType) {
        url += `/${nestedDataType}`;
    }
    url += '.json';
    if (extraParams) {
        url += `?${extraParams}`;
    }

    return (dispatch) => {
        dispatch(
            requestData(
                dataType,
                id,
                nestedDataType,
                extraParams?.replace(/[=&]/g, '_')
            )
        );
        Loader.getJson(url, null, dispatch, receiveData);
    };
}

/**
 * Saves a record through the legacy API, using PUT when an ID is present or POST
 * otherwise. Dispatches loading, success, and error actions; successful responses
 * also invalidate affected v2 caches.
 *
 * @param {Object} props - Request path or legacy project and locale context.
 * @param {string} [props.pathBase] - Route-based prefix; overrides project-based path construction.
 * @param {Object} params - Form payload keyed by the singular resource name.
 * @param {Object} [opts={}] - Submission settings.
 * @param {boolean} [opts.updateStateBeforeSubmit=false] - Apply an optimistic update for PUT.
 * @param {Function} [callback] - Receives the successful response after Redux is updated.
 * @returns {function(Function): void} Redux thunk that starts the save request.
 */
export function submitData(props, params, opts = {}, callback) {
    let dataType = Object.keys(params)[0];
    let pluralizedDataType = pluralize(dataType);
    const payloadData = params?.[dataType] || {};
    const id = payloadData.id;

    if (id) {
        // Keep caller-owned form state immutable. Some forms reuse the same params
        // object across multiple saves, so deleting id in-place would switch PUT -> POST.
        // The API expects id in the URL for updates, not in the request body.
        const payload = {
            ...params,
            [dataType]: Object.keys(payloadData).reduce((acc, key) => {
                if (key !== 'id') {
                    acc[key] = payloadData[key];
                }
                return acc;
            }, {}),
        };
        return (dispatch) => {
            // Dispatch REQUEST_DATA to set loading state
            dispatch(requestData(pluralizedDataType, id));

            if (opts.updateStateBeforeSubmit)
                dispatch(
                    updateData(
                        pluralizedDataType,
                        id,
                        Object.values(payload)[0]
                    )
                );
            Loader.put(
                `${props.pathBase || pathBase(props)}/${pluralizedDataType}/${id}`,
                payload,
                dispatch,
                receiveMutationData,
                (error) => receiveError(pluralizedDataType, id, error),
                callback
            );
        };
    } else {
        console.warn('submitData: No ID found, using POST instead of PUT', {
            dataType,
            params: params[dataType],
        });
        return (dispatch) => {
            // Start status tracking for POST under segments.all (no item id available).
            // This dispatch is required so the UI can transition fetching -> error/success
            // and show the correct notification on failed create/update fallbacks.
            dispatch(requestData(pluralizedDataType));
            //dispatch(addData(params));
            Loader.post(
                `${props.pathBase || pathBase(props)}/${pluralizedDataType}`,
                params,
                dispatch,
                receiveMutationData,
                (error) => receiveError(pluralizedDataType, null, error),
                callback
            );
        };
    }
}

/**
 * Deletes a record through the legacy API and invalidates affected v2 caches.
 * By default, removes the cached legacy record before sending the request.
 *
 * @param {Object} props - Request path or legacy project and locale context.
 * @param {string} [props.pathBase] - Route-based prefix; overrides project-based path construction.
 * @param {string} dataType - Plural name of the parent resource.
 * @param {number|string} id - Parent or standalone record ID.
 * @param {?string} [nestedDataType] - Nested resource name, when deleting a child.
 * @param {number|string|null} [nestedId] - Nested record ID.
 * @param {boolean} [skipRemove=false] - Send DELETE without removing the cached record first.
 * @param {boolean} [onlyRemove=false] - Remove locally without DELETE; ignored when skipRemove is true.
 * @param {Function} [callback] - Receives the successful API response.
 * @returns {function(Function): void} Redux thunk that removes the record or starts DELETE.
 */
export function deleteData(
    props,
    dataType,
    id,
    nestedDataType,
    nestedId,
    skipRemove = false,
    onlyRemove = false,
    callback
) {
    let url = `${props.pathBase || pathBase(props)}/${dataType}/${id}`;
    if (nestedDataType) {
        url += `/${nestedDataType}/${nestedId}`;
    }

    if (skipRemove) {
        return (dispatch) => {
            Loader.delete(
                url,
                dispatch,
                (json) => ({
                    ...receiveMutationData(json),
                    mutationResource: dataType,
                }),
                callback
            );
        };
    } else if (onlyRemove) {
        return (dispatch) => {
            dispatch(removeData(id, dataType, nestedDataType, nestedId));
        };
    } else {
        return (dispatch) => {
            dispatch(removeData(id, dataType, nestedDataType, nestedId));
            Loader.delete(
                url,
                dispatch,
                (json) => ({
                    ...receiveMutationData(json),
                    mutationResource: dataType,
                }),
                callback
            );
        };
    }
}

export function clearStateData(dataType, id, nestedDataType, nestedId) {
    return (dispatch) => {
        dispatch(removeData(id, dataType, nestedDataType, nestedId));
    };
}

export function cleanStatusMsg(dataType, msgOrIndex) {
    return (dispatch) => {
        dispatch(deleteStatusMsg(dataType, msgOrIndex));
    };
}

const deleteStatusMsg = (dataType, msgOrIndex) => ({
    type: DELETE_STATUS_MSG,
    dataType: dataType,
    msgOrIndex: msgOrIndex,
});
