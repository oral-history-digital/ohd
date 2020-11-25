import { getEditView, getLocale, getTranslations, getProjectId,
    getArchiveId } from './archiveSelectors';

const state = {
    archive: {
        locale: 'de',
        translations: {
            de: 'dummy',
            en: 'dummy',
        },
        editView: true,
        projectId: 'cdoh',
        archiveId: 'cd003',
    },
};

test('getEditView retrieves editView status', () => {
    expect(getEditView(state)).toBe(true);
});

test('getLocale retrieves current locale', () => {
    expect(getLocale(state)).toBe('de');
});

test('getTranslations retrieves translations object', () => {
    expect(getTranslations(state)).toStrictEqual({
        de: 'dummy',
        en: 'dummy',
    });
});

test('getProjectId retrieves project id', () => {
    expect(getProjectId(state)).toBe('cdoh');
});

test('getArchiveId retrieves archive id', () => {
    expect(getArchiveId(state)).toBe('cd003');
});
