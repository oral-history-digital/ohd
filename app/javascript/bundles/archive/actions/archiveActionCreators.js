/* eslint-disable import/prefer-default-export */

import request from 'superagent';
import Loader from '../../../lib/loader'

import { 
    SET_LOCALE,
    SET_ARCHIVE_ID,

    //UPLOAD_TRANSCRIPT_URL,
    //UPLOADED_TRANSCRIPT,

    CHANGE_TO_EDIT_VIEW,

    //EXPORT_DOI,
    RECEIVE_RESULT
} from '../constants/archiveConstants';

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale: locale,
});

export const setArchiveId = (archiveId) => ({
    type: SET_ARCHIVE_ID,
    archiveId: archiveId,
});

const uploadedTranscript = (json) => ({
    type: UPLOADED_TRANSCRIPT,
    json: json
});

export function submitTranscript(params) {
    return dispatch => {
        Loader.post(UPLOAD_TRANSCRIPT_URL, params, dispatch, uploadedTranscript);
    }
}

export function changeToEditView(bool) {
    return {
        type: CHANGE_TO_EDIT_VIEW,
        editView: bool
    }
}

const receiveResult = (result) => ({
    type: RECEIVE_RESULT,
    result: result
});

export function submitDois(archiveIds, locale='de') {
    return dispatch => {
        request
            .post('/de/interviews/dois')
            .send({ archive_ids: archiveIds })
            .set('Accept', 'application/json')
            .then(res => {
                if (res) {
                    dispatch(receiveResult(JSON.parse(res.text)));
                }
            });
    }
}
