import { Loader } from 'modules/api';
import { pathBase } from 'modules/routes';
import { pluralize } from 'modules/strings';

import {
    DELETE_STATUS_MSG,
    RECEIVE_DATA,
    REMOVE_DATA,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';

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

    if (params[dataType].id) {
        let id = params[dataType].id;
        delete params[dataType].id;
        return (dispatch) => {
            if (opts.updateStateBeforeSubmit)
                dispatch(
                    updateData(pluralizedDataType, id, Object.values(params)[0])
                );
            Loader.put(
                `${pathBase(props)}/${pluralizedDataType}/${id}`,
                params,
                dispatch,
                receiveData,
                undefined,
                callback
            );
        };
    } else {
        return (dispatch) => {
            //dispatch(addData(params));
            Loader.post(
                `${pathBase(props)}/${pluralizedDataType}`,
                params,
                dispatch,
                receiveData,
                undefined,
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
