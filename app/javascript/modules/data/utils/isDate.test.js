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

test('returns true for German-style dates', () => {
    const actual = isDate('12.2.2019');
    const expected = true;
    expect(actual).toEqual(expected);
});

test('returns true for US-style dates', () => {
    const actual = isDate('2/12/2019');
    const expected = true;
    expect(actual).toEqual(expected);
});

test('returns false for invalid dates', () => {
    const actual = isDate('2019-24-40');
    const expected = false;
    expect(actual).toEqual(expected);
});

test('returns false for non-date strings', () => {
    const actual = isDate('First: 13.2.2026, Second: 14.2.2026');
    const expected = false;
    expect(actual).toEqual(expected);
});
