import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
    getIsPlaying,
    getMediaTime,
    sendTimeChangeRequest,
    updateIsPlaying,
    updateMediaTime,
} from 'modules/media-player';
import { timecodeToSeconds } from 'modules/utils';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Controls "preview" playback for a single segment.
 *
 * Instead of tracking a separate play state, this hook uses Redux
 * `isPlaying` as the single source of truth combined with a
 * `previewActive` flag that enables auto-stop at the segment boundary.
 *
 * @param {object} segment - Segment object with `tape_nbr` and `timecode` (string).
 * @param {string|null|undefined} nextSegmentTimecode - Timecode string of the
 *   next segment (e.g. "00:01:30.500"). Preview stops here. When null/undefined
 *   the preview plays to the end of the media without an automatic stop.
 * @returns {{ isPreviewPlaying: boolean, togglePlayPause: function, seekToStart: function, seekBy: function, currentTime: number }}
 */
export function useSegmentPreview(segment, nextSegmentTimecode) {
    const dispatch = useDispatch();
    const mediaTime = useSelector(getMediaTime);
    const isPlaying = useSelector(getIsPlaying);

    // Calculate the correct segment start time from timecode instead of trusting
    // segment.time from the backend, which may have conversion issues.
    // This ensures frame-based and millisecond-based timecodes are correctly converted.
    const segmentStartTime = useMemo(
        () => timecodeToSeconds(segment.timecode),
        [segment.timecode]
    );

    // When true, playback will auto-stop when the end of the segment is reached.
    const stopAtSegmentBoundaryRef = useRef(false);

    // Track whether the initial seek to segment start has been dispatched.
    // Before that, currentTime returns segment start time to avoid a flash of
    // wrong button states.
    const initializedRef = useRef(false);

    const stopAtSeconds = useMemo(
        () =>
            nextSegmentTimecode ? timecodeToSeconds(nextSegmentTimecode) : null,
        [nextSegmentTimecode]
    );

    const isInSegmentRange = useCallback(
        (time) =>
            time >= segmentStartTime &&
            (stopAtSeconds === null || time < stopAtSeconds),
        [segmentStartTime, stopAtSeconds]
    );

    // Seek to segment start on mount so the main player is aligned with
    // the preview and button states are immediately correct.
    // Also re-run when segment timecode changes (e.g., when timecode is edited).
    useEffect(() => {
        dispatch(updateMediaTime(segmentStartTime));
        dispatch(sendTimeChangeRequest(segment.tape_nbr, segmentStartTime));
        initializedRef.current = true;
    }, [segmentStartTime, segment.tape_nbr, dispatch]);

    // Auto-stop at the segment boundary when preview is active.
    // Seeks back to segment start and deactivates preview.
    useEffect(() => {
        if (
            stopAtSegmentBoundaryRef.current &&
            stopAtSeconds !== null &&
            mediaTime >= stopAtSeconds
        ) {
            stopAtSegmentBoundaryRef.current = false;
            dispatch(updateIsPlaying(false));
            dispatch(updateMediaTime(segmentStartTime));
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segmentStartTime));
        }
    }, [
        mediaTime,
        stopAtSeconds,
        segmentStartTime,
        segment.tape_nbr,
        dispatch,
    ]);

    // Pause on unmount if preview is still active
    useEffect(() => {
        return () => {
            if (stopAtSegmentBoundaryRef.current) {
                stopAtSegmentBoundaryRef.current = false;
                dispatch(updateIsPlaying(false));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            dispatch(updateIsPlaying(false));
        } else {
            // If mediaTime is within the segment, resume from current
            // position; otherwise seek to segment start.
            if (!isInSegmentRange(mediaTime)) {
                dispatch(
                    sendTimeChangeRequest(segment.tape_nbr, segmentStartTime)
                );
            }
            stopAtSegmentBoundaryRef.current = true;
            dispatch(updateIsPlaying(true));
        }
    }, [
        isPlaying,
        mediaTime,
        segment.tape_nbr,
        segmentStartTime,
        isInSegmentRange,
        dispatch,
    ]);

    const seekToStart = useCallback(() => {
        dispatch(updateMediaTime(segmentStartTime));
        dispatch(sendTimeChangeRequest(segment.tape_nbr, segmentStartTime));
    }, [segmentStartTime, segment.tape_nbr, dispatch]);

    const seekBy = useCallback(
        (offsetSeconds) => {
            let target = mediaTime + offsetSeconds;
            // Clamp within segment boundaries
            target = Math.max(target, segmentStartTime);
            if (stopAtSeconds !== null) {
                target = Math.min(target, stopAtSeconds);
            }
            dispatch(updateMediaTime(target));
            dispatch(sendTimeChangeRequest(segment.tape_nbr, target));
        },
        [mediaTime, segmentStartTime, stopAtSeconds, segment.tape_nbr, dispatch]
    );

    // Clamp displayed time to segment boundaries.
    let clampedTime = mediaTime;
    if (clampedTime < segmentStartTime) {
        clampedTime = segmentStartTime;
    }
    if (stopAtSeconds !== null && clampedTime > stopAtSeconds) {
        clampedTime = stopAtSeconds;
    }

    // Before the mount effect has fired, return segment start time so
    // button disabled states are correct on the very first render.
    const currentTime = initializedRef.current ? clampedTime : segmentStartTime;

    // isPreviewPlaying = actually playing AND preview is controlling it.
    // Falls back to just isPlaying so the button stays in sync with the
    // main player regardless of how playback was started/stopped.
    const isPreviewPlaying = isPlaying;

    return {
        isPreviewPlaying,
        togglePlayPause,
        seekToStart,
        seekBy,
        currentTime,
    };
}
