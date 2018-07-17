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

const requestData = (dataType, id, nestedDataType) => ({
    type: REQUEST_DATA,
    id: id,
    dataType: dataType,
    nestedDataType: nestedDataType,
});

const receiveData = (json) => ({
    type: RECEIVE_DATA,
    id: json.archive_id || json.id,
    data: json.data,
    dataType: json.data_type,
    nestedDataType: json.nested_data_type,
    nestedId: json.nested_id,
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
    let dataType = Object.keys(params)[0]; 
    let pluralizedDataType;
    switch(dataType) {
        case 'person':
            pluralizedDataType = 'people';
            break;
        case 'history': 
            pluralizedDataType = 'histories';
            break;
        default:
            pluralizedDataType = `${dataType}s`;
    }

    if(params[dataType].id) {
        return dispatch => {
            // TODO: extend params for updateData for nestedData-case
            //dispatch(updateData(pluralizedDataType, params[dataType].id, params[dataType]));
            Loader.put(`/${locale}/${pluralizedDataType}/${params[dataType].id}`, params, dispatch, receiveData);
        }
    } else {
        return dispatch => {
            //dispatch(addData(params));
            Loader.post(`/${locale}/${pluralizedDataType}`, params, dispatch, receiveData);
        }
    }
}

export function deleteData(dataType, id, nestedDataType, nestedId, locale='de') {
    let url = `/${locale}/${dataType}/${id}`
    if  (nestedDataType)
        url += `/${nestedDataType}/${nestedId}`

    return dispatch => {
        dispatch(removeData(id, dataType, nestedDataType, nestedId))
        Loader.delete(url, dispatch, null);
    }
}

