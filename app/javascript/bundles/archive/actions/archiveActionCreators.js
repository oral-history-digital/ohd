/* eslint-disable import/prefer-default-export */

import request from 'superagent';
import Loader from '../../../lib/loader'
import { setCookie } from '../../../lib/utils'

import {
    SET_LOCALE,
    SET_ARCHIVE_ID,
    SET_PROJECT_ID,
    SET_VIEW_MODE,

    CHANGE_TO_EDIT_VIEW,
    CHANGE_TO_INTERVIEW_EDIT_VIEW,
    SET_SKIP_EMPTY_ROWS,
    SELECT_INTERVIEW_EDIT_VIEW_COLUMNS,

    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS,
    SET_SELECTED_ARCHIVE_IDS,
    UPDATE_SELECTED_REGISTRY_ENTRY_IDS
} from '../constants/archiveConstants';

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale: locale,
});

export const setArchiveId = (archiveId) => ({
    type: SET_ARCHIVE_ID,
    archiveId: archiveId,
});

export const setProjectId = (projectId) => ({
    type: SET_PROJECT_ID,
    projectId: projectId,
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

const interviewEditView = (bool) => ({
    type: CHANGE_TO_INTERVIEW_EDIT_VIEW,
    interviewEditView: bool
});

export function changeToInterviewEditView(bool) {
    return dispatch => {
        dispatch(interviewEditView(bool));
        // remove cookie through negative expiration time:
        let expireDays = bool ? 3 : -1;
        setCookie('interviewEditView', bool, expireDays);
    }
}

export const setSkipEmptyRows = (bool) => ({
    type: SET_SKIP_EMPTY_ROWS,
    skipEmptyRows: bool,
});

const setSelectedInterviewEditViewColumns = (params) => ({
    type: SELECT_INTERVIEW_EDIT_VIEW_COLUMNS,
    interviewEditViewColumns: params
});

export function selectInterviewEditViewColumns(params) {
    return dispatch => {
        dispatch(setSelectedInterviewEditViewColumns(params));
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

const updateSelectedRegistryEntryIds = (rid) => ({
    type: UPDATE_SELECTED_REGISTRY_ENTRY_IDS,
    rid: rid
});

export function addRemoveRegistryEntryId(rid) {
    return dispatch => {
        dispatch(updateSelectedRegistryEntryIds(rid))
    }
};

const setSelectedArchiveIds = (archiveIds) => ({
    type: SET_SELECTED_ARCHIVE_IDS,
    archiveIds: archiveIds
});

export function setArchiveIds(archiveIds) {
    return dispatch => {
        dispatch(setSelectedArchiveIds(archiveIds))
    }
};
