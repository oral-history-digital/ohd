import { createSelector } from 'reselect';

import { VIEWMODE_GRID } from 'modules/constants';
import { NAME } from './constants';

const getState = state => state[NAME];

export const getProjectId = state => getState(state).projectId;

export const getArchiveId = state => getState(state).archiveId;

export const getDoiResult = state => getState(state).doiResult;


// I18n
export const getLocale = state => getState(state).locale;

export const getTranslations = state => getState(state).translations;

export const getCountryKeys = state => getState(state).countryKeys;


// UI: Search results tabs
export const getViewModes = createSelector(
    [getState, getProjectId],
    (archive, projectId) => {
        if (projectId) {
            return archive.viewModes;
        } else {
            return [VIEWMODE_GRID];
        }
    }
);

export const getViewMode = createSelector(
    [getState, getProjectId],
    (archive, projectId) => {
        if (projectId) {
            return archive.viewMode;
        } else {
            return VIEWMODE_GRID;
        }
    }
);

// UI: Admin
export const getEditView = state => getState(state).editView;

export const getTranslationsView = state => getState(state).translationsView;

export const getInterviewEditView = createSelector(
    [getState],
    archive => {
        return (archive.interviewEditView === true || archive.interviewEditView === 'true');
    }
);

export const getSkipEmptyRows = state => getState(state).skipEmptyRows;

export const getSelectedInterviewEditViewColumns = state => getState(state).selectedInterviewEditViewColumns;

export const getSelectedArchiveIds = state => getState(state).selectedArchiveIds;

export const getSelectedRegistryEntryIds = createSelector(
    getState,
    archive => archive.selectedRegistryEntryIds.filter(id => id !== 'dummy')
);
