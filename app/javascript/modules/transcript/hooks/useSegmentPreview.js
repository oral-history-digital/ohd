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
 * @param {object} segment - Segment object with `tape_nbr` and `time` (seconds).
 * @param {string|null|undefined} nextSegmentTimecode - Timecode string of the
 *   next segment (e.g. "00:01:30.500"). Preview stops here. When null/undefined
 *   the preview plays to the end of the media without an automatic stop.
 * @returns {{ isPreviewPlaying: boolean, togglePlayPause: function, seekToStart: function, seekBy: function, currentTime: number }}
 */
export function useSegmentPreview(segment, nextSegmentTimecode) {
    const dispatch = useDispatch();
    const mediaTime = useSelector(getMediaTime);
    const isPlaying = useSelector(getIsPlaying);

    // When true, playback will auto-stop when the end of the segment is reached.
    const stopAtSegmentBoundaryRef = useRef(false);

    // Track whether the initial seek to segment start has been dispatched.
    // Before that, currentTime returns segment.time to avoid a flash of
    // wrong button states.
    const initializedRef = useRef(false);

    const stopAtSeconds = useMemo(
        () =>
            nextSegmentTimecode ? timecodeToSeconds(nextSegmentTimecode) : null,
        [nextSegmentTimecode]
    );

    const isInSegmentRange = useCallback(
        (time) =>
            time >= segment.time &&
            (stopAtSeconds === null || time < stopAtSeconds),
        [segment.time, stopAtSeconds]
    );

    // Seek to segment start on mount so the main player is aligned with
    // the preview and button states are immediately correct.
    useEffect(() => {
        dispatch(updateMediaTime(segment.time));
        dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        initializedRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            dispatch(updateMediaTime(segment.time));
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
    }, [mediaTime, stopAtSeconds, segment, dispatch]);

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
                dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
            }
            stopAtSegmentBoundaryRef.current = true;
            dispatch(updateIsPlaying(true));
        }
    }, [isPlaying, mediaTime, segment, isInSegmentRange, dispatch]);

    const seekToStart = useCallback(() => {
        dispatch(updateMediaTime(segment.time));
        dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
    }, [segment, dispatch]);

    const seekBy = useCallback(
        (offsetSeconds) => {
            let target = mediaTime + offsetSeconds;
            // Clamp within segment boundaries
            target = Math.max(target, segment.time);
            if (stopAtSeconds !== null) {
                target = Math.min(target, stopAtSeconds);
            }
            dispatch(updateMediaTime(target));
            dispatch(sendTimeChangeRequest(segment.tape_nbr, target));
        },
        [mediaTime, segment, stopAtSeconds, dispatch]
    );

    // Clamp displayed time to segment boundaries.
    let clampedTime = mediaTime;
    if (clampedTime < segment.time) {
        clampedTime = segment.time;
    }
    if (stopAtSeconds !== null && clampedTime > stopAtSeconds) {
        clampedTime = stopAtSeconds;
    }

    // Before the mount effect has fired, return segment start time so
    // button disabled states are correct on the very first render.
    const currentTime = initializedRef.current ? clampedTime : segment.time;

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
