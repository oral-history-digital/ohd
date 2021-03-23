import isHeadingActive from './isHeadingActive';

describe('within the same tape', () => {
    test('is false if current time is before first heading', () => {
        const actual = isHeadingActive({
            thisHeadingTape: 1,
            thisHeadingTime: 15,
            nextHeadingTape: 1,
            nextHeadingTime: 30,
            currentTape: 1,
            currentTime: 10,
        });
        const expected = false;

        expect(actual).toBe(expected);
    });

    test('is true if current time is between headings', () => {
        const actual = isHeadingActive({
            thisHeadingTape: 1,
            thisHeadingTime: 15,
            nextHeadingTape: 1,
            nextHeadingTime: 30,
            currentTape: 1,
            currentTime: 20,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });

    test('is false if current time is after next heading', () => {
        const actual = isHeadingActive({
            thisHeadingTape: 1,
            thisHeadingTime: 15,
            nextHeadingTape: 1,
            nextHeadingTime: 30,
            currentTape: 1,
            currentTime: 40,
        });
        const expected = false;

        expect(actual).toBe(expected);
    });
});

describe('special cases', () => {
    test('works if several tapes lie between headings', () => {
        const actual = isHeadingActive({
            thisHeadingTape: 1,
            thisHeadingTime: 600,
            nextHeadingTape: 5,
            nextHeadingTime: 0,
            currentTape: 3,
            currentTime: 210,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });

    test('works for last heading', () => {
        const actual = isHeadingActive({
            thisHeadingTape: 6,
            thisHeadingTime: 500,
            nextHeadingTape: undefined,
            nextHeadingTime: undefined,
            currentTape: 6,
            currentTime: 550,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });
});
