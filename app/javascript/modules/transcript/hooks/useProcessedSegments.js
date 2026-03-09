import { useMemo } from 'react';

import { sortedSegmentsWithActiveIndex } from '../utils';

export function useProcessedSegments(interview, tape, intervieweeId) {
    return useMemo(() => {
        if (!interview?.segments) return [];

        const [, segments] = sortedSegmentsWithActiveIndex(0, {
            interview,
            tape,
        });

        // Annotate speaker changes and interviewee flag here so the segment
        // objects are stable references — mutating them inside the render loop
        // below would still work (same ref), but doing it here keeps the render
        // loop pure and makes the mutations visible to memoized children.
        let currentSpeakerName = '';
        let currentSpeakerId = null;
        segments.forEach((segment) => {
            segment.speaker_is_interviewee =
                intervieweeId === segment.speaker_id;
            if (
                (currentSpeakerId !== segment.speaker_id &&
                    segment.speaker_id !== null) ||
                (currentSpeakerName !== segment.speaker &&
                    segment.speaker !== null &&
                    segment.speaker_id === null)
            ) {
                segment.speakerIdChanged = true;
                currentSpeakerId = segment.speaker_id;
                currentSpeakerName = segment.speaker;
            } else {
                segment.speakerIdChanged = false;
            }
        });

        return segments;
    }, [interview, tape, intervieweeId]);
}
