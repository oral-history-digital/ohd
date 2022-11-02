import getPageRange from './getPageRange';

test('works with uneven window size', () => {
    const actual = getPageRange(50, 10, 5);
    const expected = [8, 9, 10, 11, 12];

    expect(actual).toEqual(expected);
});

test('works with even window size', () => {
    const actual = getPageRange(50, 10, 6);
    const expected = [8, 9, 10, 11, 12, 13];

    expect(actual).toEqual(expected);
});

test('works with fewer pages than window size', () => {
    const actual = getPageRange(3, 2, 5);
    const expected = [1, 2, 3];

    expect(actual).toEqual(expected);
});

test('works at the left edge', () => {
    const actual = getPageRange(50, 1, 5);
    const expected = [1, 2, 3, 4, 5];

    expect(actual).toEqual(expected);
});

test('works at the right edge', () => {
    const actual = getPageRange(50, 50, 5);
    const expected = [46, 47, 48, 49, 50];

    expect(actual).toEqual(expected);
});
