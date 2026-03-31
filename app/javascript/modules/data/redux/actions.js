import { Loader } from 'modules/api';
import { pathBase } from 'modules/routes';
import { pluralize } from 'modules/strings';

import {
    DELETE_STATUS_MSG,
    RECEIVE_DATA,
    RECEIVE_ERROR,
    REMOVE_DATA,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';

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

const receiveData = (json) => ({
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

export function fetchData(props, dataType, id, nestedDataType, extraParams) {
    let url = `${pathBase(props)}/${dataType}`;
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
                `${pathBase(props)}/${pluralizedDataType}/${id}`,
                payload,
                dispatch,
                receiveData,
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
                `${pathBase(props)}/${pluralizedDataType}`,
                params,
                dispatch,
                receiveData,
                (error) => receiveError(pluralizedDataType, null, error),
                callback
            );
        };
    }
}

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
    let url = `${pathBase(props)}/${dataType}/${id}`;
    if (nestedDataType) {
        url += `/${nestedDataType}/${nestedId}`;
    }

    if (skipRemove) {
        return (dispatch) => {
            Loader.delete(url, dispatch, receiveData, callback);
        };
    } else if (onlyRemove) {
        return (dispatch) => {
            dispatch(removeData(id, dataType, nestedDataType, nestedId));
        };
    } else {
        return (dispatch) => {
            dispatch(removeData(id, dataType, nestedDataType, nestedId));
            Loader.delete(url, dispatch, receiveData, callback);
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
