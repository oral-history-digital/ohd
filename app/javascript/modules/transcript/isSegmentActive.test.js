import isSegmentActive from './isSegmentActive';

describe('within the same tape', () => {
    test('is false if current time is before segment', () => {
        const actual = isSegmentActive({
            thisSegmentTape: 1,
            thisSegmentTime: 15,
            nextSegmentTape: 1,
            nextSegmentTime: 30,
            currentTape: 1,
            currentTime: 10,
        });
        const expected = false;

        expect(actual).toBe(expected);
    });

    test('is true if current time is after segment and before next segment', () => {
        const actual = isSegmentActive({
            thisSegmentTape: 1,
            thisSegmentTime: 15,
            nextSegmentTape: 1,
            nextSegmentTime: 30,
            currentTape: 1,
            currentTime: 20,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });

    test('is false if current time is after next segment', () => {
        const actual = isSegmentActive({
            thisSegmentTape: 1,
            thisSegmentTime: 15,
            nextSegmentTape: 1,
            nextSegmentTime: 30,
            currentTape: 1,
            currentTime: 40,
        });
        const expected = false;

        expect(actual).toBe(expected);
    });
});

describe('special cases', () => {
    test('works if a tape lies between segments', () => {
        const actual = isSegmentActive({
            thisSegmentTape: 1,
            thisSegmentTime: 600,
            nextSegmentTape: 2,
            nextSegmentTime: 0,
            currentTape: 1,
            currentTime: 610,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });

    test('works for last segment', () => {
        const actual = isSegmentActive({
            thisSegmentTape: 6,
            thisSegmentTime: 500,
            nextSegmentTape: undefined,
            nextSegmentTime: undefined,
            currentTape: 6,
            currentTime: 550,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });

    test('is true some milliseconds before actually being active', () => {
        const actual = isSegmentActive({
            thisSegmentTape: 1,
            thisSegmentTime: 15,
            nextSegmentTape: 1,
            nextSegmentTime: 30,
            currentTape: 1,
            currentTime: 14.97,
        });
        const expected = true;

        expect(actual).toBe(expected);
    });
});
