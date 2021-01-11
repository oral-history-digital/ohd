import { createSelector } from 'reselect';

const getArchive = state => state.archive;

export const getProjectId = state => getArchive(state).projectId;

export const getArchiveId = state => getArchive(state).archiveId;

export const getContributionTypes = state => getArchive(state).contributionTypes;

export const getMediaStreams = state => getArchive(state).mediaStreams;

export const getDoiResult = state => getArchive(state).doiResult;


// I18n
export const getLocale = state => getArchive(state).locale;

export const getLocales = state => getArchive(state).locales;

export const getTranslations = state => getArchive(state).translations;

export const getCountryKeys = state => getArchive(state).countryKeys;


// UI: Search results tabs
export const getViewModes = state => getArchive(state).viewModes;

export const getViewMode = state => getArchive(state).viewMode;


// UI: Admin
export const getEditView = state => getArchive(state).editView;

export const getInterviewEditView = createSelector(
    [getArchive],
    archive => {
        return (archive.interviewEditView === true || archive.interviewEditView === 'true');
    }
);

export const getSkipEmptyRows = state => getArchive(state).skipEmptyRows;

export const getSelectedInterviewEditViewColumns = state => getArchive(state).selectedInterviewEditViewColumns;

export const getSelectedArchiveIds = state => getArchive(state).selectedArchiveIds;

export const getSelectedRegistryEntryIds = createSelector(
    getArchive,
    archive => archive.selectedRegistryEntryIds.filter(id => id !== 'dummy')
);

// not used anymore
// state.archive.randomFeaturedInterviews
// state.archive.listColumns
