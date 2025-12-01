import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
    const activeSegmentId = useMemo(() => {
        if (!transcriptCoupled) return null;

        for (const { segment, nextSegment } of segmentsWithSpeakerInfo) {
            if (segment.tape_nbr !== tape) continue;

            const nextTime =
                nextSegment?.tape_nbr === tape ? nextSegment.time : Infinity;
            if (mediaTime >= segment.time && mediaTime < nextTime) {
                return segment.id;
            }
        }
        return null;
    }, [segmentsWithSpeakerInfo, mediaTime, tape, transcriptCoupled]);

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
                {segmentsWithSpeakerInfo.map(
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
