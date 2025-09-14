import t from './t';

// The project's runtime i18n stores translations keyed by translation key,
// with per-locale strings: { key: { de: '...', en: '...' } }
const translations = {
    warning: {
        de: 'Achtung!',
        en: 'Beware!',
    },
};

it('translates into one language', () => {
    const props = {
        translations,
        statuses: { translations: { warning: 'fetched' } },
        locale: 'de',
    };

    const actual = t(props, 'warning');
    const expected = 'Achtung!';
    expect(actual).toBe(expected);
});

it('translates into another language', () => {
    const props = {
        translations,
        statuses: { translations: { warning: 'fetched' } },
        locale: 'en',
    };

    const actual = t(props, 'warning');
    const expected = 'Beware!';
    expect(actual).toBe(expected);
});
