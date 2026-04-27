import { getSegmentWorkbookAnnotations } from './getSegmentWorkbookAnnotations';

describe('getSegmentWorkbookAnnotations', () => {
    const savedSegments = [
        {
            id: 10,
            reference_id: 123,
            reference_type: 'Segment',
            description: 'German bookmark',
        },
        {
            id: 11,
            reference_id: 123,
            reference_type: 'Segment',
            description: 'English bookmark',
        },
        {
            id: 12,
            reference_id: 999,
            reference_type: 'Segment',
            description: 'Other segment bookmark',
        },
        {
            id: 13,
            reference_id: 123,
            reference_type: 'Interview',
            description: 'Wrong reference type',
        },
    ];

    it('returns segment workbook annotations for the given segment id', () => {
        const result = getSegmentWorkbookAnnotations(savedSegments, 123);

        expect(result).toEqual([
            {
                id: 10,
                reference_id: 123,
                reference_type: 'Segment',
                description: 'German bookmark',
            },
            {
                id: 11,
                reference_id: 123,
                reference_type: 'Segment',
                description: 'English bookmark',
            },
        ]);
    });

    it('keeps backward-compatible alias behavior', () => {
        const result = getSegmentWorkbookAnnotations(savedSegments, 123, 'de');

        expect(result).toEqual([
            {
                id: 10,
                reference_id: 123,
                reference_type: 'Segment',
                description: 'German bookmark',
            },
            {
                id: 11,
                reference_id: 123,
                reference_type: 'Segment',
                description: 'English bookmark',
            },
        ]);
    });
});
