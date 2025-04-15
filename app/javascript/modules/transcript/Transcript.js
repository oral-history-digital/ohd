import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { HelpText } from 'modules/help-text';
import { useIsEditor } from 'modules/archive';
import { Spinner } from 'modules/spinners';
import { useProject } from 'modules/routes';
import { isSegmentActive } from 'modules/interview-helpers';
import { usePeople } from 'modules/person';
import SegmentContainer from './SegmentContainer';
import sortedSegmentsWithActiveIndex from './sortedSegmentsWithActiveIndex';
import getContributorInformation from './getContributorInformation';

export default function Transcript({
    interview,
    intervieweeId,
    archiveId,
    transcriptFetched,
    transcriptLocale,
    originalLocale,
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
    const { data: people, isLoading: peopleAreLoading } = usePeople();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const isEditor = useIsEditor();
    const hasTranscript = interview.alpha3s_with_transcript.indexOf(transcriptLocale) > -1;

    const contributorInformation = useMemo(() => getContributorInformation(
        interview.contributions, people),
        [interview.contributions, people]
    );

    useEffect(() => {
        // Only scroll to top if media has not started yet and auto scroll is off.
        // Otherwise, scrolling is handled in Segment component.
        if (!autoScroll && isIdle) {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (loadSegments && !transcriptFetched) {
            fetchData({ locale, projectId, project }, 'interviews', archiveId, 'segments');
        }
    }, [loadSegments, transcriptFetched, archiveId]);

    const openSegmentPopup = useCallback((segmentId, popupType) => setPopupState({
        popupSegmentId: segmentId,
        popupType,
        openReference: null,
    }), []);

    const closeSegmentPopup = useCallback(() => setPopupState({
        popupSegmentId: null,
        popupType: null,
        openReference: null,
    }), []);

    const setOpenReference = useCallback(reference => setPopupState(oldPopupState => ({
        ...oldPopupState,
        openReference: oldPopupState.openReference === reference ? null : reference,
    })), []);

    const { popupSegmentId, popupType, openReference } = popupState;

    if (!transcriptFetched || peopleAreLoading) {
        return <Spinner />;
    }

    if (!hasTranscript) {
        return originalLocale ? t('without_transcript') : t('without_translation');
    }

    let tabIndex = originalLocale ? 0 : 1;
    let sortedWithIndex = sortedSegmentsWithActiveIndex(mediaTime, { interview, tape });
    let shownSegments = sortedWithIndex[1];
    let currentSpeakerName = '', currentSpeakerId = null;

    return (
        <>
            {isEditor && <HelpText code="interview_transcript" className="u-mb" />}
            <div className="Transcript">
                {
                    shownSegments.map((segment, index, array) => {
                        segment.speaker_is_interviewee = intervieweeId === segment.speaker_id;
                        if (
                            (currentSpeakerId !== segment.speaker_id && segment.speaker_id !== null) ||
                            (currentSpeakerName !== segment.speaker && segment.speaker !== null && segment.speaker_id === null)
                        ) {
                            segment.speakerIdChanged = true;
                            currentSpeakerId = segment.speaker_id;
                            currentSpeakerName = segment.speaker;
                        }

                        const nextSegment = array[index + 1];
                        const active = interview.transcript_coupled && isSegmentActive({
                            thisSegmentTape: segment.tape_nbr,
                            thisSegmentTime: segment.time,
                            nextSegmentTape: nextSegment?.tape_nbr,
                            nextSegmentTime: nextSegment?.time,
                            currentTape: tape,
                            currentTime: mediaTime,
                        });

                        return (
                            <SegmentContainer
                                key={segment.id}
                                data={segment}
                                speakerInitials={contributorInformation[segment.speaker_id]?.initials}
                                speakerName={contributorInformation[segment.speaker_id]?.fullname}
                                contentLocale={transcriptLocale}
                                popupType={popupSegmentId === segment.id ? popupType : null}
                                openReference={popupSegmentId === segment.id ? openReference : null}
                                openPopup={openSegmentPopup}
                                closePopup={closeSegmentPopup}
                                setOpenReference={setOpenReference}
                                tabIndex={tabIndex}
                                active={active}
                                transcriptCoupled={interview.transcript_coupled}
                            />
                        );
                    })
                }
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

Transcript.defaultProps = {
    originalLocale: false,
};
