import { setCookie } from 'modules/persistence';
import request from 'superagent';

import {
    CHANGE_TO_EDIT_VIEW,
    CHANGE_TO_INTERVIEW_EDIT_VIEW,
    CHANGE_TO_TRANSLATIONS_VIEW,
    CLEAR_VIEW_MODES,
    MERGE_TRANSLATIONS,
    RECEIVE_RESULT,
    REQUEST_TRANSLATIONS,
    SET_ARCHIVE_ID,
    SET_AVAILABLE_VIEW_MODES,
    SET_LOCALE,
    SET_PROJECT_ID,
    SET_SELECTED_ARCHIVE_IDS,
    SET_VIEW_MODE,
    UPDATE_SELECTED_ARCHIVE_IDS,
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

// Neue Action-Creator:

const setTranslationsDigest = (digest) => ({
    type: SET_TRANSLATIONS_DIGEST,
    digest,
});

/**
 * Checks whether the server-side translations have changed by comparing
 * a lightweight digest. Only fetches the full translation payload when
 * the digest differs from the one stored in Redux.
 *
 * Cost: one tiny JSON request (~40 bytes) instead of the full payload.
 */
export function fetchTranslationsForLocale(locale, pathBase) {
    return (dispatch, getState) => {
        const state = getState();
        const existingDigest = state.archive.translationsDigest;
        const existingTranslations = state.archive.translations || {};

        const hasTranslationsForLocale = Object.keys(existingTranslations).some(
            (key) =>
                existingTranslations[key] && existingTranslations[key][locale]
        );

        // If we have no translations at all for this locale, skip the
        // digest check and fetch immediately.
        if (!hasTranslationsForLocale) {
            return fetchFullTranslations(dispatch, locale, pathBase);
        }

        // Otherwise, ask the server for the current digest first.
        const digestUrl = `${pathBase}/translation_strings/digest.json`;

        return request
            .get(digestUrl)
            .then((response) => {
                const serverDigest = response.body.digest;

                if (serverDigest === existingDigest) {
                    // Nothing changed – no need to re-fetch.
                    return Promise.resolve();
                }

                // Digest differs → translations have changed on the server.
                return fetchFullTranslations(
                    dispatch,
                    locale,
                    pathBase,
                    serverDigest
                );
            })
            .catch((error) => {
                console.error('Failed to check translation digest:', error);
                // Graceful degradation: keep existing translations.
                return Promise.resolve();
            });
    };
}

function fetchFullTranslations(dispatch, locale, pathBase, digest) {
    dispatch(requestTranslations());

    const url = `${pathBase}/translation_strings.json`;

    return request
        .get(url)
        .then((response) => {
            dispatch(mergeTranslations(response.body.translations || {}));

            // Persist the digest so subsequent checks can compare.
            // If we didn't get a digest yet (first load), fetch it.
            if (digest) {
                dispatch(setTranslationsDigest(digest));
            } else {
                const digestUrl = `${pathBase}/translation_strings/digest.json`;
                return request.get(digestUrl).then((res) => {
                    dispatch(setTranslationsDigest(res.body.digest));
                });
            }
        })
        .catch((error) => {
            console.error('Failed to fetch translations:', error);
        });
}
