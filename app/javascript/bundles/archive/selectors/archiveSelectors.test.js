import * as selectors from './archiveSelectors';

const state = {
    archive: {
        locale: 'de',
        locales: ['de', 'es'],
        projectId: 'cdoh',
        viewModes: ['grid', 'list'],
        viewMode: 'grid',
        editView: true,
        translations: {
            de: 'dummy',
            en: 'dummy',
        },
        contributionTypes: {
            cinematographer: 'cinematographer',
        },
        archiveId: 'cd003',
        interviewEditView: true,
        skipEmptyRows: false,
        selectedInterviewEditViewColumns: ['timecode', 'text_orig'],
        selectedArchiveIds: ['cd007', 'cd003'],
        selectedRegistryEntryIds: [82, 5],
        countryKeys: {
            de: ['AF'],
            es: ['AF'],
        },
        mediaStreams: {
            defaults: {},
            video: {},
            audio: {},
        },
        doiResult: {},
    },
};

test('getLocale retrieves current locale', () => {
    expect(selectors.getLocale(state)).toEqual(state.archive.locale);
});

test('getLocales retrieves available locales', () => {
    expect(selectors.getLocales(state)).toEqual(state.archive.locales);
});

test('getProjectId retrieves project id', () => {
    expect(selectors.getProjectId(state)).toEqual(state.archive.projectId);
});

test('getViewModes retrieves available view modes', () => {
    expect(selectors.getViewModes(state)).toEqual(state.archive.viewModes);
});

test('getViewMode retrieves current view mode', () => {
    expect(selectors.getViewMode(state)).toEqual(state.archive.viewMode);
});

test('getEditView retrieves editView status', () => {
    expect(selectors.getEditView(state)).toEqual(state.archive.editView);
});

test('getTranslations retrieves translations object', () => {
    expect(selectors.getTranslations(state)).toEqual(state.archive.translations);
});

test('getArchiveId retrieves archive id', () => {
    expect(selectors.getArchiveId(state)).toEqual(state.archive.archiveId);
});

test('getContributionTypes retrieves contributionTypes object', () => {
    expect(selectors.getContributionTypes(state)).toEqual(state.archive.contributionTypes);
});

test('getInterviewEditView retrieves interviewEditView status', () => {
    expect(selectors.getInterviewEditView(state)).toEqual(state.archive.interviewEditView);
});

test('getSkipEmptyRows retrieves skipEmptyRows status', () => {
    expect(selectors.getSkipEmptyRows(state)).toEqual(state.archive.skipEmptyRows);
});

test('getSelectedInterviewEditViewColumns retrieves selected interview table columns', () => {
    expect(selectors.getSelectedInterviewEditViewColumns(state)).toEqual(state.archive.selectedInterviewEditViewColumns);
});

test('getCountryKeys retrieves country keys array', () => {
    expect(selectors.getCountryKeys(state)).toEqual(state.archive.countryKeys);
});

test('getSelectedArchiveIds retrieves selected archive ids', () => {
    expect(selectors.getSelectedArchiveIds(state)).toEqual(state.archive.selectedArchiveIds);
});

test('getSelectedRegistryEntryIds retrieves selected registry entry ids', () => {
    expect(selectors.getSelectedRegistryEntryIds(state)).toEqual(state.archive.selectedRegistryEntryIds);
});

test('getMediaStreams retrieves media streams', () => {
    expect(selectors.getMediaStreams(state)).toEqual(state.archive.mediaStreams);
});

test('getDoiResult retrieves doi result object', () => {
    expect(selectors.getDoiResult(state)).toEqual(state.archive.doiResult);
});
