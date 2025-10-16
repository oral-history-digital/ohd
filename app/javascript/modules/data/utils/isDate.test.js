import { isDate } from './isDate';

test('returns true for full ISO 8601 dates', () => {
    const actual = isDate('2019-02-12');
    const expected = true;
    expect(actual).toEqual(expected);
});

test('trims input strings', () => {
    const actual = isDate(' 2019-02-12 ');
    const expected = true;
    expect(actual).toEqual(expected);
});

test('returns false for dates that are not full', () => {
    const actual = isDate('2019-02');
    const expected = false;
    expect(actual).toEqual(expected);
});

test('returns false for invalid dates', () => {
    const actual = isDate('2019-24-40');
    const expected = false;
    expect(actual).toEqual(expected);
});
