import { getSegmentTimecodeBounds } from './getSegmentTimecodeBounds';

describe('getSegmentTimecodeBounds', () => {
    it('uses only same-tape previous and next segment timecodes', () => {
        const segment = { tape_nbr: 2, timecode: '00:00:35.960' };
        const prevSegment = { tape_nbr: 2, timecode: '00:00:20.000' };
        const nextSegment = { tape_nbr: 2, timecode: '00:00:50.000' };

        expect(
            getSegmentTimecodeBounds(segment, prevSegment, nextSegment)
        ).toEqual({
            prevSegmentTimecode: '00:00:20.000',
            nextSegmentTimecode: '00:00:50.000',
        });
    });

    it('returns no previous bound for the first segment of a tape when previous list neighbor is from another tape', () => {
        const segment = { tape_nbr: 2, timecode: '00:00:35.960' };
        const prevSegment = { tape_nbr: 1, timecode: '00:46:24.025' };
        const nextSegment = { tape_nbr: 2, timecode: '00:01:00.000' };

        expect(
            getSegmentTimecodeBounds(segment, prevSegment, nextSegment)
        ).toEqual({
            prevSegmentTimecode: undefined,
            nextSegmentTimecode: '00:01:00.000',
        });
    });

    it('returns no next bound for the last segment of a tape when next list neighbor is from another tape', () => {
        const segment = { tape_nbr: 1, timecode: '00:46:24.025' };
        const prevSegment = { tape_nbr: 1, timecode: '00:46:00.000' };
        const nextSegment = { tape_nbr: 2, timecode: '00:00:35.960' };

        expect(
            getSegmentTimecodeBounds(segment, prevSegment, nextSegment)
        ).toEqual({
            prevSegmentTimecode: '00:46:00.000',
            nextSegmentTimecode: undefined,
        });
    });
});
