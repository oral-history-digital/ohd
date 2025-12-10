import getTextAndLang from './getTextAndLang';

test('gets text and lang if locale is found', () => {
    const texts = {
        'ru-public': 'И потоманцы',
        'de-public': 'Und dann',
    };

    const actual = getTextAndLang(texts, 'de', 'pl');
    const expected = ['Und dann', 'de'];
    expect(actual).toEqual(expected);
});

test('gets text and lang if locale is not found', () => {
    const texts = {
        ru: 'И потоманцы',
        de: 'Und dann',
    };

    const actual = getTextAndLang(texts, 'en', 'ru');
    const expected = ['И потоманцы', 'ru'];
    expect(actual).toEqual(expected);
});

test('gets first text as fallback', () => {
    const texts = {
        ru: 'И потоманцы',
        de: 'Und dann',
    };

    const actual = getTextAndLang(texts, 'en', 'pl');
    const expected = ['И потоманцы', 'ru'];
    expect(actual).toEqual(expected);
});
