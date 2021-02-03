import t from './t';

const translations = {
    de: {
        warning: 'Achtung!',
    },
    en: {
        warning: 'Beware!'
    },
};

it('translates into one language', () => {
    const props = {
        translations,
        locale: 'de',
    };

    const actual = t(props, 'warning');
    const expected = 'Achtung!';
    expect(actual).toBe(expected);
});

it('translates into another language', () => {
    const props = {
        translations,
        locale: 'en',
    };

    const actual = t(props, 'warning');
    const expected = 'Beware!';
    expect(actual).toBe(expected);
});
