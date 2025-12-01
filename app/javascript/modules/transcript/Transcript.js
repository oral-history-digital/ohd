import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useIsEditor } from 'modules/archive';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { useInterviewContributors } from 'modules/person';
import { useProject } from 'modules/routes';
import SegmentContainer from './components/SegmentContainer';
import TranscriptSkeleton from './components/TranscriptSkeleton';
import {
    getContributorInformation,
    sortedSegmentsWithActiveIndex,
} from './utils';

export default function Transcript({
    interview,
    intervieweeId,
    archiveId,
    transcriptFetched,
    transcriptLocale,
    originalLocale = false,
    loadSegments,
    mediaTime,
    isIdle,
    tape,
    autoScroll,
    fetchData,
}) {
    const [popupState, setPopupState] = useState({
        popupSegmentId: null,
        popupType: null,
        openReference: null,
    });
    const { data: people, isLoading: peopleAreLoading } =
        useInterviewContributors(interview.id);
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const isEditor = useIsEditor();
    const hasTranscript =
        interview.alpha3s_with_transcript.indexOf(transcriptLocale) > -1;

    const contributorInformation = useMemo(
        () => getContributorInformation(interview.contributions, people),
        [interview.contributions, people]
    );

    const isRtlLanguage = useCallback((loc) => {
        const rtlLanguages = ['ara', 'heb'];
        return rtlLanguages.includes(loc);
    }, []);

    useEffect(() => {
        // Only scroll to top if media has not started yet and auto scroll is off.
        // Otherwise, scrolling is handled in Segment component.
        if (!autoScroll && isIdle) {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (loadSegments && !transcriptFetched) {
            fetchData(
                { locale, projectId, project },
                'interviews',
                archiveId,
                'segments'
            );
        }
    }, [loadSegments, transcriptFetched, archiveId]);

    const openSegmentPopup = useCallback(
        (segmentId, popupType) =>
            setPopupState({
                popupSegmentId: segmentId,
                popupType,
                openReference: null,
            }),
        []
    );

    const closeSegmentPopup = useCallback(
        () =>
            setPopupState({
                popupSegmentId: null,
                popupType: null,
                openReference: null,
            }),
        []
    );

    const setOpenReference = useCallback(
        (reference) =>
            setPopupState((oldPopupState) => ({
                ...oldPopupState,
                openReference:
                    oldPopupState.openReference === reference
                        ? null
                        : reference,
            })),
        []
    );

    const { popupSegmentId, popupType, openReference } = popupState;

    // Memoize sorted segments with speaker info to avoid recalculating on every render
    // Depend on interview.segments reference, not the whole interview object
    const interviewSegments = interview?.segments;
    const firstSegmentIds = interview?.first_segments_ids;
    const tapeCount = interview?.tape_count;

    const segmentsWithSpeakerInfo = useMemo(() => {
        if (!interviewSegments) return [];

        const [, shownSegments] = sortedSegmentsWithActiveIndex(0, {
            interview: {
                segments: interviewSegments,
                first_segments_ids: firstSegmentIds,
                tape_count: tapeCount,
            },
            tape,
        });

        let currentSpeakerName = '';
        let currentSpeakerId = null;

        return shownSegments.map((segment, index, array) => {
            // Create a new object with computed properties instead of mutating
            const speakerIdChanged =
                (currentSpeakerId !== segment.speaker_id &&
                    segment.speaker_id !== null) ||
                (currentSpeakerName !== segment.speaker &&
                    segment.speaker !== null &&
                    segment.speaker_id === null);

            if (speakerIdChanged) {
                currentSpeakerId = segment.speaker_id;
                currentSpeakerName = segment.speaker;
            }

            return {
                segment,
                speakerIdChanged,
                speakerIsInterviewee: intervieweeId === segment.speaker_id,
                nextSegment: array[index + 1] || null,
            };
        });
    }, [interviewSegments, firstSegmentIds, tapeCount, tape, intervieweeId]);

    // Calculate only the active segment ID - this changes with mediaTime
    // but we only pass the ID to children, not recalculate for all
    const transcriptCoupled = interview.transcript_coupled;
    const activeSegmentIndex = useMemo(() => {
        if (!transcriptCoupled) return -1;

        for (let i = 0; i < segmentsWithSpeakerInfo.length; i++) {
            const { segment, nextSegment } = segmentsWithSpeakerInfo[i];
            if (segment.tape_nbr !== tape) continue;

            const nextTime =
                nextSegment?.tape_nbr === tape ? nextSegment.time : Infinity;
            if (mediaTime >= segment.time && mediaTime < nextTime) {
                return i;
            }
        }
        return -1;
    }, [segmentsWithSpeakerInfo, mediaTime, tape, transcriptCoupled]);

    const activeSegmentId =
        activeSegmentIndex >= 0
            ? segmentsWithSpeakerInfo[activeSegmentIndex]?.segment.id
            : null;

    // Virtualization: render a window of segments that expands as user scrolls
    // Start with initial chunk, expand when user scrolls near edges
    const INITIAL_RENDER = 200;
    const LOAD_MORE_COUNT = 100;

    const [renderRange, setRenderRange] = useState({
        start: 0,
        end: INITIAL_RENDER,
    });
    const topSentinelRef = useRef(null);
    const bottomSentinelRef = useRef(null);
    const prevTapeRef = useRef(tape);

    // Find the first segment index for the current tape
    const firstSegmentIndexForTape = useMemo(() => {
        for (let i = 0; i < segmentsWithSpeakerInfo.length; i++) {
            if (segmentsWithSpeakerInfo[i].segment.tape_nbr === tape) {
                return i;
            }
        }
        return 0;
    }, [segmentsWithSpeakerInfo, tape]);

    // Handle tape changes and active segment tracking
    useEffect(() => {
        const tapeChanged = prevTapeRef.current !== tape;
        prevTapeRef.current = tape;

        if (tapeChanged) {
            // Tape changed - immediately set range to include first segment of new tape
            const start = Math.max(0, firstSegmentIndexForTape - 10);
            const end = Math.min(
                segmentsWithSpeakerInfo.length,
                firstSegmentIndexForTape + INITIAL_RENDER
            );
            setRenderRange({ start, end });
            return;
        }

        // Normal playback - expand range if active segment is near edges
        if (activeSegmentIndex < 0) return;

        setRenderRange((prev) => {
            const buffer = 50;
            let { start, end } = prev;

            if (activeSegmentIndex > end - buffer) {
                end = Math.min(
                    segmentsWithSpeakerInfo.length,
                    activeSegmentIndex + INITIAL_RENDER
                );
            }
            if (activeSegmentIndex < start + buffer) {
                start = Math.max(0, activeSegmentIndex - INITIAL_RENDER);
            }

            if (start !== prev.start || end !== prev.end) {
                return { start, end };
            }
            return prev;
        });
    }, [
        tape,
        activeSegmentIndex,
        firstSegmentIndexForTape,
        segmentsWithSpeakerInfo.length,
    ]);

    // IntersectionObserver to load more when scrolling to edges
    useEffect(() => {
        const options = { root: null, rootMargin: '200px', threshold: 0 };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                setRenderRange((prev) => {
                    const total = segmentsWithSpeakerInfo.length;
                    let { start, end } = prev;

                    if (
                        entry.target === bottomSentinelRef.current &&
                        end < total
                    ) {
                        // Scrolling down - load more at bottom
                        end = Math.min(total, end + LOAD_MORE_COUNT);
                    } else if (
                        entry.target === topSentinelRef.current &&
                        start > 0
                    ) {
                        // Scrolling up - load more at top
                        start = Math.max(0, start - LOAD_MORE_COUNT);
                    }

                    if (start !== prev.start || end !== prev.end) {
                        return { start, end };
                    }
                    return prev;
                });
            });
        };

        const observer = new IntersectionObserver(handleIntersect, options);

        if (topSentinelRef.current) observer.observe(topSentinelRef.current);
        if (bottomSentinelRef.current)
            observer.observe(bottomSentinelRef.current);

        return () => observer.disconnect();
    }, [segmentsWithSpeakerInfo.length]);

    const visibleSegments = useMemo(() => {
        return segmentsWithSpeakerInfo.slice(
            renderRange.start,
            renderRange.end
        );
    }, [segmentsWithSpeakerInfo, renderRange.start, renderRange.end]);

    if (!transcriptFetched || peopleAreLoading) {
        return <TranscriptSkeleton count={5} />;
    }

    if (!hasTranscript) {
        return originalLocale
            ? t('without_transcript')
            : t('without_translation');
    }

    const tabIndex = originalLocale ? 0 : 1;

    return (
        <>
            {isEditor && (
                <HelpText code="interview_transcript" className="u-mb" />
            )}
            <div
                className={classNames('Transcript', {
                    'Transcript--rtl': isRtlLanguage(transcriptLocale),
                })}
            >
                {/* Sentinel for loading more segments when scrolling up */}
                {renderRange.start > 0 && (
                    <div ref={topSentinelRef} style={{ height: 1 }} />
                )}

                {visibleSegments.map(
                    ({ segment, speakerIdChanged, speakerIsInterviewee }) => {
                        const isActive = segment.id === activeSegmentId;
                        const hasPopup = popupSegmentId === segment.id;

                        return (
                            <SegmentContainer
                                key={segment.id}
                                data={segment}
                                speakerIdChanged={speakerIdChanged}
                                speakerIsInterviewee={speakerIsInterviewee}
                                speakerInitials={
                                    contributorInformation[segment.speaker_id]
                                        ?.initials
                                }
                                speakerName={
                                    contributorInformation[segment.speaker_id]
                                        ?.fullname
                                }
                                contentLocale={transcriptLocale}
                                popupType={hasPopup ? popupType : null}
                                openReference={hasPopup ? openReference : null}
                                openPopup={openSegmentPopup}
                                closePopup={closeSegmentPopup}
                                setOpenReference={setOpenReference}
                                tabIndex={tabIndex}
                                active={isActive}
                                transcriptCoupled={transcriptCoupled}
                            />
                        );
                    }
                )}

                {/* Sentinel for loading more segments when scrolling down */}
                {renderRange.end < segmentsWithSpeakerInfo.length && (
                    <div ref={bottomSentinelRef} style={{ height: 1 }} />
                )}
            </div>
        </>
    );
}

Transcript.propTypes = {
    originalLocale: PropTypes.bool,
    loadSegments: PropTypes.bool,
    archiveId: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    isIdle: PropTypes.bool.isRequired,
    tape: PropTypes.number.isRequired,
    autoScroll: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    intervieweeId: PropTypes.number,
    transcriptFetched: PropTypes.bool.isRequired,
    transcriptLocale: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
};
