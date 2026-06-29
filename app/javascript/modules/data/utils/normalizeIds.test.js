import { normalizeProjectDbId, normalizeShortname } from './normalizeIds';

test('returns null for invalid project DB ID', () => {
    const values = [
        null,
        undefined,
        'some_string',
        {},
        [],
        NaN,
        Infinity,
        -Infinity,
        -7,
    ];

    values.forEach((value) => {
        const actual = normalizeProjectDbId(value);
        expect(actual).toEqual(null);
    });
});

test('returns normalized project DB ID', () => {
    const values = [
        [12, 12],
        ['34', 34],
        [' 56 ', 56],
    ];

    values.forEach(([input, expected]) => {
        const actual = normalizeProjectDbId(input);
        expect(actual).toEqual(expected);
    });
});

test('returns null for invalid shortname', () => {
    const values = [null, undefined, '', '   ', [], {}];

    values.forEach((value) => {
        const actual = normalizeShortname(value);
        expect(actual).toEqual(null);
    });
});

test('returns normalized shortname', () => {
    const values = [
        ['abc', 'abc'],
        ['  abc  ', 'abc'],
        ['123', '123'],
        ['abc-123', 'abc-123'],
    ];

    values.forEach(([input, expected]) => {
        const actual = normalizeShortname(input);
        expect(actual).toEqual(expected);
    });
});
