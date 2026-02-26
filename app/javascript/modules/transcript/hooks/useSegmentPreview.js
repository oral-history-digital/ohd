import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
 * Seeks to the segment start, starts playback, and automatically pauses
 * when the media time reaches the start of the next segment.
 * Syncs back to stopped state if the user pauses via the main player controls.
 * Pauses on unmount if preview is still active.
 *
 * @param {object} segment - Segment object with `tape_nbr` and `time` (seconds).
 * @param {string|null|undefined} nextSegmentTimecode - Timecode string of the
 *   next segment (e.g. "00:01:30.500"). Preview stops here. When null/undefined
 *   the preview plays to the end of the media without an automatic stop.
 * @returns {{ isPreviewPlaying: boolean, togglePreview: function }}
 */
export function useSegmentPreview(segment, nextSegmentTimecode) {
    const dispatch = useDispatch();
    const mediaTime = useSelector(getMediaTime);
    const isPlaying = useSelector(getIsPlaying);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const isPreviewPlayingRef = useRef(false);

    const stopAtSeconds = useMemo(
        () =>
            nextSegmentTimecode ? timecodeToSeconds(nextSegmentTimecode) : null,
        [nextSegmentTimecode]
    );

    // Keep ref in sync so the cleanup effect always sees the latest value
    // without needing it in its dependency array
    isPreviewPlayingRef.current = isPreviewPlaying;

    // Auto-pause when mediaTime reaches the next segment boundary.
    // Seek back to the segment start so mediaTime in Redux is reset well below
    // the boundary — the video's timeupdate fires every ~250ms so we can
    // overshoot; seeking back ensures isSegmentActive never flips for the next
    // segment. Auto-scroll during editing is also suppressed in EditableSegment.
    useEffect(() => {
        if (
            isPreviewPlaying &&
            stopAtSeconds !== null &&
            mediaTime >= stopAtSeconds
        ) {
            dispatch(updateIsPlaying(false));
            // Synchronously reset mediaTime in Redux to the segment start so
            // isSegmentActive never flips true for the next segment while the
            // async VideoJS seek-back is in flight (which would scroll to it).
            dispatch(updateMediaTime(segment.time));
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
            setIsPreviewPlaying(false);
        }
    }, [mediaTime, isPreviewPlaying, stopAtSeconds, segment, dispatch]);

    // Sync: if the user manually pauses via the main player, cancel preview state
    useEffect(() => {
        if (isPreviewPlaying && !isPlaying) {
            setIsPreviewPlaying(false);
        }
    }, [isPlaying, isPreviewPlaying]);

    // Pause on unmount if preview is still active
    useEffect(() => {
        return () => {
            if (isPreviewPlayingRef.current) {
                dispatch(updateIsPlaying(false));
            }
        };
        // dispatch is stable, no other deps needed here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const togglePreview = useCallback(() => {
        if (isPreviewPlaying) {
            dispatch(updateIsPlaying(false));
            setIsPreviewPlaying(false);
        } else {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
            dispatch(updateIsPlaying(true));
            setIsPreviewPlaying(true);
        }
    }, [isPreviewPlaying, segment, dispatch]);

    return { isPreviewPlaying, togglePreview, currentTime: mediaTime };
}
