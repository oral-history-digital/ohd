/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    REQUEST_PERSON,
    RECEIVE_PERSON,

    UPDATE_PERSON,
    PEOPLE_URL,
} from '../constants/archiveConstants';

const requestPerson = (id) => ({
    type: REQUEST_PERSON,
    id: id,
});

function receivePerson(json){
    return {
        type: RECEIVE_PERSON,
        id: json.archive_id,
        interview: json,
        receivedAt: Date.now()
    }
}

export function fetchPerson(id) {
  return dispatch => {
    dispatch(requestPerson(id))
    Loader.getJson(`${PEOPLE_URL}/${id}`, null, dispatch, receivePerson);
  }
}

const updatePerson = (params) => ({
    type: UPDATE_PERSON,
    params: params,
});

export function submitPerson(params) {
    if(params.id) {
        return dispatch => {
            dispatch(updatePerson(params))
            Loader.put(`${PEOPLE_URL}/${params.id}`, params, dispatch, receivePerson);
        }
    } else {
        return dispatch => {
            Loader.post(PEOPLE_URL, params, dispatch, receivePerson);
        }
    }
}
