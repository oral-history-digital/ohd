import { NAME } from './constants';

import { createSelector } from 'reselect';

const getState = state => state[NAME];

export const getProjectId = state => getState(state).projectId;

export const getArchiveId = state => getState(state).archiveId;

export const getContributionTypes = state => getState(state).contributionTypes;

export const getMediaStreams = state => getState(state).mediaStreams;

export const getDoiResult = state => getState(state).doiResult;


// I18n
export const getLocale = state => getState(state).locale;

export const getLocales = state => getState(state).locales;

export const getTranslations = state => getState(state).translations;

export const getCountryKeys = state => getState(state).countryKeys;


// UI: Search results tabs
export const getViewModes = state => getState(state).viewModes;

export const getViewMode = state => getState(state).viewMode;


// UI: Admin
export const getEditView = state => getState(state).editView;

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

// not used anymore
// state.archive.randomFeaturedInterviews
// state.archive.listColumns
