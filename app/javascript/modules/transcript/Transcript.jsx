import { useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { getArchiveId, useIsEditor } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getCurrentIntervieweeId,
    getTranscriptFetched,
} from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { getAutoScroll } from 'modules/interview';
import { getCurrentTape, getIsIdle } from 'modules/media-player';
import { useInterviewContributors } from 'modules/person';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { EditableSegment, TranscriptSkeleton } from './components';
import { useProcessedSegments, useSegmentEditing } from './hooks';
import { getContributorInformation, isRtlLanguage } from './utils';

export default function Transcript({
    transcriptLocale,
    originalLocale = false,
    loadSegments,
}) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const isEditviewActive = useIsEditor();

    // Redux state
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const tape = useSelector(getCurrentTape);
    const autoScroll = useSelector(getAutoScroll);
    const isIdle = useSelector(getIsIdle);
    const transcriptFetched = useSelector(getTranscriptFetched);

    const { data: people, isLoading: peopleAreLoading } =
        useInterviewContributors(interview?.id);
    const hasTranscript =
        interview?.alpha3s_with_transcript?.indexOf(transcriptLocale) > -1;

    const segmentEditing = useSegmentEditing();
    const { editingSegmentId } = segmentEditing;

    const contributorInformation = useMemo(
        () => getContributorInformation(interview?.contributions, people),
        [interview?.contributions, people]
    );

    useEffect(() => {
        // Only scroll to top if media has not started yet and auto scroll is off.
        // Otherwise, scrolling is handled in Segment component.
        if (!autoScroll && isIdle) {
            window.scrollTo(0, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loadSegments && !transcriptFetched) {
            dispatch(
                fetchData(
                    { locale, projectId, project },
                    'interviews',
                    archiveId,
                    'segments'
                )
            );
        }
    }, [
        loadSegments,
        transcriptFetched,
        archiveId,
        locale,
        projectId,
        project,
        dispatch,
    ]);

    const processedSegments = useProcessedSegments(
        interview,
        tape,
        intervieweeId
    );

    if (!interview || !transcriptFetched || peopleAreLoading) {
        return <TranscriptSkeleton count={5} />;
    }

    if (!hasTranscript) {
        return originalLocale
            ? t('without_transcript')
            : t('without_translation');
    }

    return (
        <>
            {isEditviewActive && (
                <HelpText code="interview_transcript" className="u-mb" />
            )}
            <div
                className={classNames('Transcript', {
                    'Transcript--rtl': isRtlLanguage(transcriptLocale),
                })}
                data-testid="transcript"
            >
                {processedSegments.map((segment, index, array) => {
                    const prevSegment = array[index - 1];
                    const nextSegment = array[index + 1];
                    const isEditingSegment =
                        isEditviewActive && editingSegmentId === segment.id;

                    return (
                        <EditableSegment
                            key={`editable-segment-${segment.id}`}
                            segment={segment}
                            interview={interview}
                            contributor={
                                contributorInformation[segment.speaker_id]
                            }
                            contentLocale={transcriptLocale}
                            nextSegmentTime={nextSegment?.time}
                            nextSegmentTape={nextSegment?.tape_nbr}
                            isEditingSegment={isEditingSegment}
                            segmentEditing={segmentEditing}
                            prevSegmentTimecode={prevSegment?.timecode}
                            nextSegmentTimecode={nextSegment?.timecode}
                        />
                    );
                })}
            </div>
        </>
    );
}

Transcript.propTypes = {
    originalLocale: PropTypes.bool,
    loadSegments: PropTypes.bool,
    transcriptLocale: PropTypes.string,
};
