import request from 'superagent';

import { setCookie } from 'modules/persistence';

import {
    SET_LOCALE,
    SET_ARCHIVE_ID,
    SET_PROJECT_ID,
    SET_AVAILABLE_VIEW_MODES,
    SET_VIEW_MODE,
    CLEAR_VIEW_MODES,
    CHANGE_TO_EDIT_VIEW,
    CHANGE_TO_INTERVIEW_EDIT_VIEW,
    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS,
    SET_SELECTED_ARCHIVE_IDS,
    UPDATE_SELECTED_REGISTRY_ENTRY_IDS,
} from './action-types';

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

export const setAvailableViewModes = viewModes => ({
    type: SET_AVAILABLE_VIEW_MODES,
    payload: viewModes,
});

export const setViewMode = viewMode => ({
    type: SET_VIEW_MODE,
    payload: viewMode,
});

export const clearViewModes = () => ({
    type: CLEAR_VIEW_MODES,
});

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

const receiveResult = (result) => ({
    type: RECEIVE_RESULT,
    result: result
});

export function submitSelectedArchiveIds(archiveIds, action, pathBase, filename, format) {
    return dispatch => {
        if (filename) {
            const link = document.createElement('a');
            const params = archiveIds.map((aid) => `archive_ids[]=${aid}`).join('&');
            link.href = `${pathBase}/interviews/${action}.${format}?${params}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } else {
            request
                .post(`${pathBase}/interviews/${action}`)
                .send({ archive_ids: archiveIds })
                .set('Accept', 'application/json')
                .then(res => {
                    if (res) {
                        dispatch(receiveResult(JSON.parse(res.text)));
                    }
                });
        }
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
}

const updateSelectedRegistryEntryIds = (rid) => ({
    type: UPDATE_SELECTED_REGISTRY_ENTRY_IDS,
    rid: rid
});

export function addRemoveRegistryEntryId(rid) {
    return dispatch => {
        dispatch(updateSelectedRegistryEntryIds(rid))
    }
}

const setSelectedArchiveIds = (archiveIds) => ({
    type: SET_SELECTED_ARCHIVE_IDS,
    archiveIds: archiveIds
})

export function setArchiveIds(archiveIds) {
    return dispatch => {
        dispatch(setSelectedArchiveIds(archiveIds))
    }
}
