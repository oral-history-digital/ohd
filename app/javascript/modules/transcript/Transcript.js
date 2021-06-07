import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import SegmentContainer from './SegmentContainer';
import sortedSegmentsWithActiveIndex from './sortedSegmentsWithActiveIndex';
import isSegmentActive from './isSegmentActive';

export default function Transcript({
    interview,
    archiveId,
    transcriptFetched,
    transcriptLocale,
    hasTranscript,
    originalLocale,
    loadSegments,
    interviewee,
    mediaTime,
    tape,
    locale,
    projectId,
    projects,
    autoScroll,
    userContentsStatus,
    fetchData,
}) {
    const [popupState, setPopupState] = useState({
        popupSegmentId: null,
        popupType: null,
        openReference: null,
    });
    const { t } = useI18n();

    useEffect(() => {
        if (!userContentsStatus) {
            fetchData({ locale, projectId, projects }, 'user_contents');
        }

        if (!autoScroll) {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (loadSegments && !transcriptFetched) {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'segments');
        }
    }, [loadSegments, transcriptFetched]);


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

    let speaker, speakerId;

    return (
        <div className="Transcript">
            {
                shownSegments.map((segment, index, array) => {
                    segment.speaker_is_interviewee = interviewee && interviewee.id === segment.speaker_id;
                    if (
                        (speakerId !== segment.speaker_id && segment.speaker_id !== null) ||
                        (speaker !== segment.speaker && segment.speaker_id === null)
                    ) {
                        segment.speakerIdChanged = true;
                        speakerId = segment.speaker_id;
                        speaker = segment.speaker;
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

                    return (
                        <SegmentContainer
                            key={segment.id}
                            data={segment}
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
    );
}

Transcript.propTypes = {
    locale: PropTypes.string.isRequired,
    originalLocale: PropTypes.bool,
    loadSegments: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    tape: PropTypes.number.isRequired,
    autoScroll: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    transcriptFetched: PropTypes.bool.isRequired,
    hasTranscript: PropTypes.bool.isRequired,
    transcriptLocale: PropTypes.string,
    userContentsStatus: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
};

Transcript.defaultProps = {
    originalLocale: false,
};
