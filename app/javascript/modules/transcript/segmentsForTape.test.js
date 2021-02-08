import segmentsForTape from './segmentsForTape';

describe('segmentsForTape', () => {
    const interview = {
        segments: {
            1: {
                39147: { id: 39147, type: 'Segment' },
            },
        },
    };

    it('returns segments for a given tape', () => {
        const actual = segmentsForTape(interview, 1);
        const expected = {
            39147: { id: 39147, type: 'Segment' },
        };
        expect(actual).toEqual(expected);
    });

    it('returns an empty object if tape is not found', () => {
        const actual = segmentsForTape(interview, 5);
        const expected = {};
        expect(actual).toEqual(expected);
    });
});
