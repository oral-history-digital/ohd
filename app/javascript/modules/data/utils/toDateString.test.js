import toDateString from './toDateString';

test('returns de style date string for de locale', () => {
    const actual = toDateString('2019-02-12', 'de');
    const expected = '12.2.2019';
    expect(actual).toEqual(expected);
});

test('returns en-GB style date string for en locale', () => {
    const actual = toDateString('2019-02-12', 'en');
    const expected = '2/12/2019';
    expect(actual).toEqual(expected);
});
