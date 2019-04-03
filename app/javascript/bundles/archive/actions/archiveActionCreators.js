/* eslint-disable import/prefer-default-export */

import request from 'superagent';
import Loader from '../../../lib/loader'
import { setCookie } from '../../../lib/utils'

import { 
    SET_LOCALE,
    SET_ARCHIVE_ID,
    SET_VIEW_MODE,

    CHANGE_TO_EDIT_VIEW,

    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS
} from '../constants/archiveConstants';

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale: locale,
});

export const setArchiveId = (archiveId) => ({
    type: SET_ARCHIVE_ID,
    archiveId: archiveId,
});

export const setViewMode = (viewMode) => ({
    type: SET_VIEW_MODE,
    viewMode: viewMode,
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

const editView = (bool) => ({
    type: CHANGE_TO_EDIT_VIEW,
    editView: bool
});

export function changeToEditView(bool) {
    return dispatch => {
        dispatch(editView(bool));
        // remove cookie through negative expiration time:
        let expireDays = bool ? 3 : -1;
        setCookie('editView', bool, expireDays);
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

const updateSelectedArchiveIds = (archiveId) => ({
    type: UPDATE_SELECTED_ARCHIVE_IDS,
    archiveId: archiveId
});

export function addRemoveArchiveId(archiveId) {
    return dispatch => {
        dispatch(updateSelectedArchiveIds(archiveId))
    }
};

