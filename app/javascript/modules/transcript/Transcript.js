import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { HelpText } from 'modules/help-text';
import { Spinner } from 'modules/spinners';
import { usePathBase } from 'modules/routes';
import { isSegmentActive } from 'modules/interview-helpers';
import { usePeople } from 'modules/person';
import SegmentContainer from './SegmentContainer';
import sortedSegmentsWithActiveIndex from './sortedSegmentsWithActiveIndex';

export default function Transcript({
    interview,
    intervieweeId,
    editView,
    archiveId,
    transcriptFetched,
    transcriptLocale,
    hasTranscript,
    originalLocale,
    loadSegments,
    mediaTime,
    isIdle,
    tape,
    locale,
    projectId,
    projects,
    autoScroll,
    workbookIsLoading,
    workbookLoaded,
    fetchData,
    fetchWorkbook,
}) {
    const [popupState, setPopupState] = useState({
        popupSegmentId: null,
        popupType: null,
        openReference: null,
    });
    const { data: people } = usePeople();
    const { t } = useI18n();
    const pathBase = usePathBase();

    useEffect(() => {
        // Only scroll to top if media has not started yet and auto scroll is off.
        // Otherwise, scrolling is handled in Segment component.
        if (!autoScroll && isIdle) {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (!workbookLoaded && !workbookIsLoading) {
            fetchWorkbook(pathBase);
        }
    }, []);

    useEffect(() => {
        if (loadSegments && !transcriptFetched) {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'segments');
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

    if (!transcriptFetched) {
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
            {editView && <HelpText code="interview_transcript" className="u-mb" />}
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
                        const active = isSegmentActive({
                            thisSegmentTape: segment.tape_nbr,
                            thisSegmentTime: segment.time,
                            nextSegmentTape: nextSegment?.tape_nbr,
                            nextSegmentTime: nextSegment?.time,
                            currentTape: tape,
                            currentTime: mediaTime,
                        });

                        let speaker;
                        if (people && segment.speaker_id) {
                            speaker = people[segment.speaker_id];
                        }

                        return (
                            <SegmentContainer
                                key={segment.id}
                                data={segment}
                                speaker={speaker}
                                contentLocale={transcriptLocale}
                                popupType={popupSegmentId === segment.id ? popupType : null}
                                openReference={popupSegmentId === segment.id ? openReference : null}
                                openPopup={openSegmentPopup}
                                closePopup={closeSegmentPopup}
                                setOpenReference={setOpenReference}
                                tabIndex={tabIndex}
                                active={active}
                            />
                        );
                    })
                }
            </div>
        </>
    );
}

Transcript.propTypes = {
    locale: PropTypes.string.isRequired,
    originalLocale: PropTypes.bool,
    editView: PropTypes.bool.isRequired,
    loadSegments: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    isIdle: PropTypes.bool.isRequired,
    tape: PropTypes.number.isRequired,
    autoScroll: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    intervieweeId: PropTypes.number,
    transcriptFetched: PropTypes.bool.isRequired,
    hasTranscript: PropTypes.bool.isRequired,
    transcriptLocale: PropTypes.string,
    workbookIsLoading: PropTypes.bool.isRequired,
    workbookLoaded: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
    fetchWorkbook: PropTypes.func.isRequired,
};

Transcript.defaultProps = {
    originalLocale: false,
};
