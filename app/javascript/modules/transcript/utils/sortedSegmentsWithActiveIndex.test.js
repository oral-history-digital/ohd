import { sortedSegmentsWithActiveIndex } from './sortedSegmentsWithActiveIndex';
import * as ActiveIndexForTapeModule from './sortedSegmentsWithActiveIndexForTape';

describe('sortedSegmentsWithActiveIndex', () => {
    // Mock for sortedSegmentsWithActiveIndexForTape
    beforeAll(() => {
        jest.spyOn(
            ActiveIndexForTapeModule,
            'sortedSegmentsWithActiveIndexForTape'
        ).mockImplementation((time, props) => {
            // Use time and props to avoid unused variable warning
            void props;
            return [
                { id: 2, time },
                [
                    { id: 2, time },
                    { id: 3, time: 15 },
                ],
                1,
            ];
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    const interview = {
        segments: {
            1: {
                1: { id: 1, time: 5 },
                2: { id: 2, time: 10 },
                3: { id: 3, time: 15 },
            },
            2: {
                4: { id: 4, time: 20 },
            },
        },
        first_segments_ids: { 1: 1, 2: 4 },
        tape_count: 2,
    };

    it('returns active segment, sorted segments, and index for the given tape', () => {
        const props = { interview, tape: 1 };
        const time = 10;
        const [activeSegment, sortedSegments, index] =
            sortedSegmentsWithActiveIndex(time, props);
        expect(activeSegment).toEqual({ id: 2, time: 10 });
        expect(sortedSegments).toEqual([
            { id: 2, time: 10 },
            { id: 3, time: 15 },
            { id: 4, time: 20 },
        ]);
        expect(index).toBe(1);
    });

    it('returns empty values if interview is missing', () => {
        const props = { tape: 1 };
        const time = 10;
        const [activeSegment, sortedSegments, index] =
            sortedSegmentsWithActiveIndex(time, props);
        expect(activeSegment).toBeNull();
        expect(sortedSegments).toEqual([]);
        expect(index).toBe(0);
    });
});
