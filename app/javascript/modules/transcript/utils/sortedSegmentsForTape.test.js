import { sortedSegmentsForTape } from './sortedSegmentsForTape';

describe('sortedSegmentsForTape', () => {
    const interview = {
        segments: {
            1: {
                39147: { id: 39147, type: 'Segment', time: 10 },
                39148: { id: 39148, type: 'Segment', time: 5 },
                39149: { id: 39149, type: 'Segment', time: 15 },
            },
            2: {
                40000: { id: 40000, type: 'Segment', time: 20 },
            },
        },
    };

    it('returns sorted segments for a given tape', () => {
        const props = { interview };
        const actual = sortedSegmentsForTape(props, 1);
        const expected = [
            { id: 39148, type: 'Segment', time: 5 },
            { id: 39147, type: 'Segment', time: 10 },
            { id: 39149, type: 'Segment', time: 15 },
        ];
        expect(actual).toEqual(expected);
    });

    it('returns an empty array if tape is not found', () => {
        const props = { interview };
        const actual = sortedSegmentsForTape(props, 5);
        expect(actual).toEqual([]);
    });

    it('returns an empty array if tape has no segments', () => {
        const props = { interview: { segments: { 3: {} } } };
        const actual = sortedSegmentsForTape(props, 3);
        expect(actual).toEqual([]);
    });

    it('returns an empty array if interview is missing', () => {
        const props = {};
        const actual = sortedSegmentsForTape(props, 1);
        expect(actual).toEqual([]);
    });
});
