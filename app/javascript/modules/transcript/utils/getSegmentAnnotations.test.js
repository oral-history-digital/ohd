import { getSegmentAnnotations } from './getSegmentAnnotations';

describe('getSegmentAnnotations', () => {
    const segment = {
        annotations: {
            1: { id: 1, text: { ger: '<p>DE note</p>' } },
            2: { id: 2, text: { ukr: '<p>UK note</p>' } },
            3: {
                id: 3,
                text: {
                    ger: '<p>Another DE note</p>',
                    'ger-public': '<p>DE public note</p>',
                },
            },
        },
    };

    it('returns only annotations that include the requested content locale', () => {
        const result = getSegmentAnnotations(segment, 'ger');

        expect(result).toEqual([
            { id: 1, text: { ger: '<p>DE note</p>' } },
            {
                id: 3,
                text: {
                    ger: '<p>Another DE note</p>',
                    'ger-public': '<p>DE public note</p>',
                },
            },
        ]);
    });

    it('returns an empty array for missing locale matches', () => {
        expect(getSegmentAnnotations(segment, 'es')).toEqual([]);
    });

    it('returns an empty array for invalid inputs', () => {
        expect(getSegmentAnnotations(null, 'ger')).toEqual([]);
        expect(getSegmentAnnotations(segment, '')).toEqual([]);
    });
});
