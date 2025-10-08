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
    CHANGE_TO_TRANSLATIONS_VIEW,
    CHANGE_TO_INTERVIEW_EDIT_VIEW,
    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS,
    SET_SELECTED_ARCHIVE_IDS,
    UPDATE_SELECTED_REGISTRY_ENTRY_IDS,
    MERGE_TRANSLATIONS,
    REQUEST_TRANSLATIONS,
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

export const setAvailableViewModes = (viewModes) => ({
    type: SET_AVAILABLE_VIEW_MODES,
    payload: viewModes,
});

export const setViewMode = (viewMode) => ({
    type: SET_VIEW_MODE,
    payload: viewMode,
});

export const clearViewModes = () => ({
    type: CLEAR_VIEW_MODES,
});

const editView = (bool) => ({
    type: CHANGE_TO_EDIT_VIEW,
    editView: bool,
});

export function changeToEditView(bool) {
    return (dispatch) => {
        dispatch(editView(bool));
        // remove cookie through negative expiration time:
        let expireDays = bool ? 3 : -1;
        setCookie('editView', bool, expireDays);
    };
}

const translationsView = (bool) => ({
    type: CHANGE_TO_TRANSLATIONS_VIEW,
    translationsView: bool,
});

export function changeToTranslationsView(bool) {
    return (dispatch) => {
        dispatch(translationsView(bool));
        // remove cookie through negative expiration time:
        let expireDays = bool ? 3 : -1;
        setCookie('translationsView', bool, expireDays);
    };
}

const interviewEditView = (bool) => ({
    type: CHANGE_TO_INTERVIEW_EDIT_VIEW,
    interviewEditView: bool,
});

export function changeToInterviewEditView(bool) {
    return (dispatch) => {
        dispatch(interviewEditView(bool));
        // remove cookie through negative expiration time:
        let expireDays = bool ? 3 : -1;
        setCookie('interviewEditView', bool, expireDays);
    };
}

const receiveResult = (result) => ({
    type: RECEIVE_RESULT,
    result: result,
});

export function submitSelectedArchiveIds(
    archiveIds,
    action,
    pathBase,
    filename,
    format
) {
    return (dispatch) => {
        if (filename) {
            const link = document.createElement('a');
            const params = archiveIds
                .map((aid) => `archive_ids[]=${aid}`)
                .join('&');
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
                .then((res) => {
                    if (res) {
                        dispatch(receiveResult(JSON.parse(res.text)));
                    }
                });
        }
    };
}

const updateSelectedArchiveIds = (archiveId) => ({
    type: UPDATE_SELECTED_ARCHIVE_IDS,
    archiveId: archiveId,
});

export function addRemoveArchiveId(archiveId) {
    return (dispatch) => {
        dispatch(updateSelectedArchiveIds(archiveId));
    };
}

const updateSelectedRegistryEntryIds = (rid) => ({
    type: UPDATE_SELECTED_REGISTRY_ENTRY_IDS,
    rid: rid,
});

export function addRemoveRegistryEntryId(rid) {
    return (dispatch) => {
        dispatch(updateSelectedRegistryEntryIds(rid));
    };
}

const setSelectedArchiveIds = (archiveIds) => ({
    type: SET_SELECTED_ARCHIVE_IDS,
    archiveIds: archiveIds,
});

export function setArchiveIds(archiveIds) {
    return (dispatch) => {
        dispatch(setSelectedArchiveIds(archiveIds));
    };
}

const mergeTranslations = (translations) => ({
    type: MERGE_TRANSLATIONS,
    translations: translations,
});

const requestTranslations = () => ({
    type: REQUEST_TRANSLATIONS,
});

export function fetchTranslationsForLocale(locale, projectId) {
    return (dispatch, getState) => {
        // Check if we already have translations for this locale
        const currentState = getState();
        const existingTranslations = currentState.archive.translations || {};

        // Check if we already have some translations for this locale
        const hasTranslationsForLocale = Object.keys(existingTranslations).some(
            (key) =>
                existingTranslations[key] && existingTranslations[key][locale]
        );

        // If we already have translations for this locale, don't fetch again
        if (hasTranslationsForLocale) {
            console.log(
                `Translations for locale ${locale} already loaded, skipping fetch`
            );
            return Promise.resolve();
        }

        dispatch(requestTranslations());

        // Build the API endpoint
        const url = projectId
            ? `/${projectId}/${locale}/api/translations.json`
            : `/${locale}/api/translations.json`;

        return request
            .get(url)
            .then((response) => {
                dispatch(mergeTranslations(response.body.translations || {}));
            })
            .catch((error) => {
                console.error('Failed to fetch translations:', error);
                // Don't dispatch anything on error to keep existing translations
            });
    };
}
