import toDateString from './toDateString';

test('returns trimmed original string if it is not a valid date', () => {
    const actual = [
        '  invalid-date  ',
        'invalid-date',
        'First: 13.2.2026, Second: 14.2.2026',
    ];
    const expected = [
        'invalid-date',
        'invalid-date',
        'First: 13.2.2026, Second: 14.2.2026',
    ];
    actual.forEach((a, i) =>
        expect(toDateString(a, 'de')).toEqual(expected[i])
    );
});

test('returns DE style date string for de locale', () => {
    const actual = [
        '2019-02-12',
        '2019-2-12',
        '12.02.2019',
        '12.2.2019',
        '02/12/2019',
        '2/12/2019',
    ];
    const expected = '12.2.2019';
    actual.forEach((a) => expect(toDateString(a, 'de')).toEqual(expected));
});

test('returns en-US style date string for en locale', () => {
    const actual = [
        '2019-02-12',
        '2019-2-12',
        '12.02.2019',
        '12.2.2019',
        '02/12/2019',
        '2/12/2019',
    ];
    const expected = '2/12/2019';
    actual.forEach((a) => expect(toDateString(a, 'en')).toEqual(expected));
});
