const getArchive = state => state.archive;

export const getEditView = state => getArchive(state).editView;

export const getLocale = state => getArchive(state).locale;

export const getTranslations = state => getArchive(state).translations;

export const getProjectId = state => getArchive(state).projectId;

export const getArchiveId = state => getArchive(state).archiveId;

export const getContributionTypes = state => getArchive(state).contributionTypes;
