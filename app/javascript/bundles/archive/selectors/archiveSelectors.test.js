import { getEditView, getLocale, getTranslations } from './archiveSelectors';

const state = {
    archive: {
        locale: 'de',
        translations: {
            de: 'dummy',
            en: 'dummy',
        },
        editView: true,
    },
};

test('getEditView retrieves editView status from state', () => {
    expect(getEditView(state)).toBe(true);
});

test('getLocale retrieves current locale from state', () => {
    expect(getLocale(state)).toBe('de');
});

test('getTranslations retrieves translations object from state', () => {
    expect(getTranslations(state)).toStrictEqual({
        de: 'dummy',
        en: 'dummy',
    });
});
