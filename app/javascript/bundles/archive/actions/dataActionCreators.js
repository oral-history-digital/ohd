/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    REQUEST_DATA,
    RECEIVE_DATA,
    UPDATE_DATA,
    //ADD_DATA,
    REMOVE_DATA,
} from '../constants/archiveConstants';

//const addData = (params) => ({
    //type: ADD_DATA,
    //params: params,
    //id: id,
    //dataType: Object.keys(params)[0],
//});

const updateData = (dataType, id, data) => ({
    type: UPDATE_DATA,
    id: id,
    dataType: dataType,
    data: data
});

const removeData = (id, dataType) => ({
    type: REMOVE_DATA,
    id: id,
    dataType: dataType,
});

const requestData = (dataType, id, nestedDataType) => ({
    type: REQUEST_DATA,
    id: id,
    dataType: dataType,
    nestedDataType: nestedDataType,
});

const receiveData = (json) => ({
    type: RECEIVE_DATA,
    id: json.archive_id || json.id,
    //id: json.data.archive_id || json.data.id,
    data: json.data,
    dataType: json.data_type,
    nestedDataType: json.nested_data_type,
});

export function fetchData(dataType, id, nestedDataType, locale='de') {
    let url = `/${locale}/${dataType}`
    if  (id)
        url += `/${id}`
    if  (nestedDataType)
        url += `/${nestedDataType}`
    return dispatch => {
        dispatch(requestData(dataType, id, nestedDataType))
        Loader.getJson(url, null, dispatch, receiveData);
    }
}

export function submitData(params, locale='de') {
    //
    // params should be in a pluralized scope, e.g.:
    //   params = {interviews: {id: 5, archiveId: 'mog002', language_id: 2}
    //
    let dataType = Object.keys(params)[0]; 

    // clean params to prevent problems with superagent through empty values
    for (var prop in params[dataType]) {
        if (!params[dataType][prop])
            delete params[dataType][prop]
    }

    if(params[dataType].id) {
        return dispatch => {
            dispatch(updateData(dataType, params[dataType].id, params[dataType]));
            Loader.put(`/${locale}/${dataType}/${params[dataType].id}`, params, dispatch, null);
        }
    } else {
        return dispatch => {
            //dispatch(addData(params));
            Loader.post(`/${locale}/${dataType}`, params, dispatch, receiveData);
        }
    }
}

export function deleteData(dataType, id, locale='de') {
    return dispatch => {
        dispatch(removeData(id, dataType))
        Loader.delete(`/${locale}/${dataType}/${id}`, dispatch, null);
    }
}

