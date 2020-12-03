const getArchive = state => state.archive;

export const getEditView = state => getArchive(state).editView;

export const getLocale = state => getArchive(state).locale;

export const getLocales = state => getArchive(state).locales;

export const getViewModes = state => getArchive(state).viewModes;

export const getViewMode = state => getArchive(state).viewMode;

export const getTranslations = state => getArchive(state).translations;

export const getProjectId = state => getArchive(state).projectId;

export const getArchiveId = state => getArchive(state).archiveId;

export const getContributionTypes = state => getArchive(state).contributionTypes;


// For interview edit table
export const getInterviewEditView = state => getArchive(state).interviewEditView;

export const getSkipEmptyRows = state => getArchive(state).skipEmptyRows;

export const getSelectedInterviewEditViewColumns = state => getArchive(state).selectedInterviewEditViewColumns;

// countryKeys
// mediaStreams

// selectedArchiveIds
// selectedRegistryEntryIds

// not used anymore
// state.archive.randomFeaturedInterviews
// state.archive.listColumns

// What is this?
// state.archive.doiResult
