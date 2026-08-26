import { renderHook } from '@testing-library/react';

import { sortedSegmentsWithActiveIndex } from '../utils';
import { useProcessedSegments } from './useProcessedSegments';

jest.mock('../utils', () => ({
    sortedSegmentsWithActiveIndex: jest.fn((activeIndex) => [
        activeIndex,
        [
            { id: 1, speaker_id: 1, speaker: 'Alice', time: '0:00' },
            { id: 2, speaker_id: 1, speaker: 'Alice', time: '0:10' },
            { id: 3, speaker_id: 2, speaker: 'Bob', time: '0:20' },
            { id: 4, speaker_id: null, speaker: 'Unknown', time: '0:30' },
            { id: 5, speaker_id: null, speaker: 'Unknown', time: '0:40' },
            { id: 6, speaker_id: 2, speaker: 'Bob', time: '0:50' },
        ],
    ]),
}));

describe('useProcessedSegments', () => {
    let result;
    let rerender;

    const render = (props) => {
        const renderedHook = renderHook(
            ({ interview, tape, intervieweeId }) =>
                useProcessedSegments(interview, tape, intervieweeId),
            { initialProps: props }
        );
        result = renderedHook.result;
        rerender = renderedHook.rerender;
    };

    afterEach(() => {
        result = null;
        rerender = null;
    });

    it('returns empty array when interview is null', () => {
        render({
            interview: null,
            tape: null,
            intervieweeId: null,
        });
        expect(result.current).toEqual([]);
    });

    it('returns empty array when interview.segments is undefined', () => {
        render({
            interview: { id: 1 },
            tape: null,
            intervieweeId: null,
        });
        expect(result.current).toEqual([]);
    });

    it('annotates segments with speaker_is_interviewee flag', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: 1,
        });

        expect(result.current[0].speaker_is_interviewee).toBe(true);
        expect(result.current[1].speaker_is_interviewee).toBe(true);
        expect(result.current[2].speaker_is_interviewee).toBe(false);
    });

    it('marks speakerIdChanged when speaker ID changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result.current[0].speakerIdChanged).toBe(true); // First segment
        expect(result.current[1].speakerIdChanged).toBe(false); // Same speaker
        expect(result.current[2].speakerIdChanged).toBe(true); // Different speaker
        expect(result.current[3].speakerIdChanged).toBe(true); // null speaker with Unknown
        expect(result.current[4].speakerIdChanged).toBe(false); // Same unknown speaker
        expect(result.current[5].speakerIdChanged).toBe(true); // Back to speaker 2
    });

    it('marks speakerIdChanged when speaker name changes (with null speaker_id)', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result.current[3].speakerIdChanged).toBe(true); // Bob (id: 2) to Unknown (id: null)
        expect(result.current[4].speakerIdChanged).toBe(false); // Unknown to Unknown
    });

    it('recomputes result when interview changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 1,
        });

        const firstResult = result.current;

        rerender({
            interview: { id: 2, segments: [{ id: 2 }] },
            tape: 1,
            intervieweeId: 1,
        });

        expect(result.current).not.toBe(firstResult);
    });

    it('recomputes result when tape changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 1,
        });

        const firstResult = result.current;

        rerender({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 2,
            intervieweeId: 1,
        });

        expect(result.current).not.toBe(firstResult);
    });

    it('recomputes result when intervieweeId changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 1,
        });

        const firstResult = result.current;

        rerender({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 2,
        });

        expect(result.current).not.toBe(firstResult);
    });

    it('marks first segment as changed when speaker is missing', () => {
        sortedSegmentsWithActiveIndex.mockImplementationOnce((activeIndex) => [
            activeIndex,
            [
                {
                    id: 1,
                    speaker_id: null,
                    speaker: undefined,
                    time: '0:00',
                },
                {
                    id: 2,
                    speaker_id: null,
                    speaker: undefined,
                    time: '0:10',
                },
            ],
        ]);

        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result.current[0].speakerIdChanged).toBe(true);
        expect(result.current[1].speakerIdChanged).toBe(false);
    });

    it('resets speaker block after a no-speaker segment', () => {
        sortedSegmentsWithActiveIndex.mockImplementationOnce((activeIndex) => [
            activeIndex,
            [
                { id: 1, speaker_id: 1, speaker: 'Alice', time: '0:00' },
                { id: 2, speaker_id: null, speaker: undefined, time: '0:10' },
                { id: 3, speaker_id: 1, speaker: 'Alice', time: '0:20' },
            ],
        ]);

        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result.current[0].speakerIdChanged).toBe(true);
        expect(result.current[1].speakerIdChanged).toBe(true);
        expect(result.current[2].speakerIdChanged).toBe(true);
    });

    it('marks only the first no-speaker segment in a run as changed', () => {
        sortedSegmentsWithActiveIndex.mockImplementationOnce((activeIndex) => [
            activeIndex,
            [
                { id: 1, speaker_id: 1, speaker: 'Alice', time: '0:00' },
                { id: 2, speaker_id: null, speaker: undefined, time: '0:10' },
                { id: 3, speaker_id: null, speaker: undefined, time: '0:20' },
            ],
        ]);

        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result.current[0].speakerIdChanged).toBe(true);
        expect(result.current[1].speakerIdChanged).toBe(true);
        expect(result.current[2].speakerIdChanged).toBe(false);
    });
});
