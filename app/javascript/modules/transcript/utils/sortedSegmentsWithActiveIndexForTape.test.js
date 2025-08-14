import { sortedSegmentsWithActiveIndexForTape } from './sortedSegmentsWithActiveIndexForTape';

describe('sortedSegmentsWithActiveIndexForTape', () => {
    const props = {
        interview: {
            segments: {
                1: {
                    1: { id: 1, time: 0 },
                    2: { id: 2, time: 7 },
                    3: { id: 3, time: 14 },
                },
            },
        },
        tape: 1,
    };

    it('returns first segment when time is 0', () => {
        const [active, sorted, index] = sortedSegmentsWithActiveIndexForTape(
            0,
            props
        );
        expect(active).toEqual({ id: 1, time: 0 });
        expect(sorted).toEqual([
            { id: 1, time: 0 },
            { id: 2, time: 7 },
            { id: 3, time: 14 },
        ]);
        expect(index).toBe(0);
    });

    it('returns correct segment for time in the middle', () => {
        const [active, , index] = sortedSegmentsWithActiveIndexForTape(
            8,
            props
        );
        expect(active).toEqual({ id: 3, time: 14 });
        expect(index).toBe(2);
    });

    it('returns last segment for time beyond last', () => {
        const [active, , index] = sortedSegmentsWithActiveIndexForTape(
            30,
            props
        );
        expect(active).toEqual({ id: 3, time: 14 });
        expect(index).toBe(2);
    });

    it('returns null if no segments', () => {
        const emptyProps = { interview: { segments: { 1: {} } }, tape: 1 };
        const [active, sorted, index] = sortedSegmentsWithActiveIndexForTape(
            0,
            emptyProps
        );
        expect(active).toBeNull();
        expect(sorted).toEqual([]);
        expect(index).toBe(0);
    });
});
