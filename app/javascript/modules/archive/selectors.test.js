import dotProp from 'dot-prop-immutable';

import { VIEWMODE_GRID } from 'modules/constants';
import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        locale: 'de',
        projectId: 'cdoh',
        viewModes: ['grid', 'list'],
        viewMode: 'list',
        editView: true,
        translations: {
            de: 'dummy',
            en: 'dummy',
        },
        archiveId: 'cd003',
        interviewEditView: true,
        skipEmptyRows: false,
        selectedInterviewEditViewColumns: ['timecode', 'text_orig'],
        selectedArchiveIds: ['cd007', 'cd003'],
        selectedRegistryEntryIds: ['dummy', 82, 5],
        countryKeys: {
            de: ['AF'],
            es: ['AF'],
        },
        doiResult: {},
    },
};

test('getLocale retrieves current locale', () => {
    expect(selectors.getLocale(state)).toEqual(state[NAME].locale);
});

test('getProjectId retrieves project id', () => {
    expect(selectors.getProjectId(state)).toEqual(state[NAME].projectId);
});

describe('getViewModes', () => {
    test('retrieves available view modes', () => {
        expect(selectors.getViewModes(state)).toEqual(state[NAME].viewModes);
    });

    test('gets default view modes if no project is selected (for OHD)', () => {
        const _state = dotProp.set(state, `${NAME}.projectId`, null);
        expect(selectors.getViewModes(_state)).toEqual([VIEWMODE_GRID]);
    });
});

describe('getViewMode', () => {
    test('retrieves current view mode', () => {
        expect(selectors.getViewMode(state)).toEqual(state[NAME].viewMode);
    });

    test('gets default view mode if no project is selected (for OHD)', () => {
        const _state = dotProp.set(state, `${NAME}.projectId`, null);
        expect(selectors.getViewMode(_state)).toEqual(VIEWMODE_GRID);
    });
});

test('getEditView retrieves editView status', () => {
    expect(selectors.getEditView(state)).toEqual(state[NAME].editView);
});

test('getTranslations retrieves translations object', () => {
    expect(selectors.getTranslations(state)).toEqual(state[NAME].translations);
});

test('getArchiveId retrieves archive id', () => {
    expect(selectors.getArchiveId(state)).toEqual(state[NAME].archiveId);
});

describe('getInterviewEditView', () => {
    test('retrieves interviewEditView status', () => {
        expect(selectors.getInterviewEditView(state)).toEqual(
            state[NAME].interviewEditView
        );
    });

    test('converts a dirty interviewEditView status', () => {
        const _state = dotProp.set(state, 'archive.interviewEditView', null);

        expect(selectors.getInterviewEditView(_state)).toBe(false);
    });
});

test('getSkipEmptyRows retrieves skipEmptyRows status', () => {
    expect(selectors.getSkipEmptyRows(state)).toEqual(
        state[NAME].skipEmptyRows
    );
});

test('getSelectedInterviewEditViewColumns retrieves selected interview table columns', () => {
    expect(selectors.getSelectedInterviewEditViewColumns(state)).toEqual(
        state[NAME].selectedInterviewEditViewColumns
    );
});

test('getCountryKeys retrieves country keys array', () => {
    expect(selectors.getCountryKeys(state)).toEqual(state[NAME].countryKeys);
});

test('getSelectedArchiveIds retrieves selected archive ids', () => {
    expect(selectors.getSelectedArchiveIds(state)).toEqual(
        state[NAME].selectedArchiveIds
    );
});

test('getSelectedRegistryEntryIds retrieves selected registry entry ids', () => {
    expect(selectors.getSelectedRegistryEntryIds(state)).toEqual([82, 5]);
});

test('getDoiResult retrieves doi result object', () => {
    expect(selectors.getDoiResult(state)).toEqual(state[NAME].doiResult);
});
