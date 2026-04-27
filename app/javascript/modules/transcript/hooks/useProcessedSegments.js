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
        let currentSpeakerKey = null;
        segments.forEach((segment, index) => {
            segment.speaker_is_interviewee =
                intervieweeId === segment.speaker_id;

            const hasSpeakerId =
                segment.speaker_id !== null && segment.speaker_id !== undefined;
            const normalizedSpeakerName =
                typeof segment.speaker === 'string'
                    ? segment.speaker.trim()
                    : segment.speaker;
            const hasSpeakerName =
                normalizedSpeakerName !== null &&
                normalizedSpeakerName !== undefined &&
                normalizedSpeakerName !== '';

            // Prefer stable numeric speaker_id. Fallback to speaker name when id is missing.
            const speakerKey = hasSpeakerId
                ? `id:${segment.speaker_id}`
                : hasSpeakerName
                  ? `name:${normalizedSpeakerName}`
                  : null;

            // Mark the first segment as a speaker change to ensure initials are shown
            if (index === 0) {
                segment.speakerIdChanged = true;
                currentSpeakerKey = speakerKey;
                return;
            }

            // Treat transition from a known speaker to no-speaker as a boundary,
            // so speaker visibility toggles when assigning/unassigning speakers.
            if (speakerKey === null) {
                segment.speakerIdChanged = currentSpeakerKey !== null;
                currentSpeakerKey = null;
                return;
            }

            if (speakerKey !== null && speakerKey !== currentSpeakerKey) {
                segment.speakerIdChanged = true;
                currentSpeakerKey = speakerKey;
            } else {
                segment.speakerIdChanged = false;
            }
        });

        return segments;
    }, [interview, tape, intervieweeId]);
}
