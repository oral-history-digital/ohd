import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { getArchiveId } from 'modules/archive';
import { useIsEditor } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getCurrentIntervieweeId,
    getTranscriptFetched,
} from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { getAutoScroll } from 'modules/interview';
import { isSegmentActive } from 'modules/interview-helpers';
import { getCurrentTape, getIsIdle, getMediaTime } from 'modules/media-player';
import { useInterviewContributors } from 'modules/person';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { EditableSegment, TranscriptSkeleton } from './components';
import {
    getContributorInformation,
    sortedSegmentsWithActiveIndex,
} from './utils';

export default function Transcript({
    transcriptLocale,
    originalLocale = false,
    loadSegments,
}) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const isEditor = useIsEditor();

    // Redux state
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const tape = useSelector(getCurrentTape);
    const mediaTime = useSelector(getMediaTime);
    const isIdle = useSelector(getIsIdle);
    const autoScroll = useSelector(getAutoScroll);
    const transcriptFetched = useSelector(getTranscriptFetched);

    const { data: people, isLoading: peopleAreLoading } =
        useInterviewContributors(interview?.id);
    const hasTranscript =
        interview?.alpha3s_with_transcript?.indexOf(transcriptLocale) > -1;

    // Track which segment is currently being edited
    const [editingSegmentId, setEditingSegmentId] = useState(null);
    const [
        editingSegmentHasUnsavedChanges,
        setEditingSegmentHasUnsavedChanges,
    ] = useState(false);

    const handleEditStart = (segmentId) => {
        if (editingSegmentId !== null && editingSegmentHasUnsavedChanges) {
            // Prevent switching if current segment has unsaved changes
            // TODO: Replace alert with nicer UI
            alert(t('modules.transcript.unsaved_changes_warning'));
            return false;
        }
        setEditingSegmentId(segmentId);
        setEditingSegmentHasUnsavedChanges(false);
        return true;
    };

    const handleEditEnd = () => {
        setEditingSegmentId(null);
        setEditingSegmentHasUnsavedChanges(false);
    };

    const contributorInformation = useMemo(
        () => getContributorInformation(interview?.contributions, people),
        [interview?.contributions, people]
    );

    const isRtlLanguage = (locale) => {
        const rtlLanguages = ['ara', 'heb'];
        return rtlLanguages.includes(locale);
    };

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

    if (!interview || !transcriptFetched || peopleAreLoading) {
        return <TranscriptSkeleton count={5} />;
    }

    if (!hasTranscript) {
        return originalLocale
            ? t('without_transcript')
            : t('without_translation');
    }

    let sortedWithIndex = sortedSegmentsWithActiveIndex(mediaTime, {
        interview,
        tape,
    });
    let shownSegments = sortedWithIndex[1];
    let currentSpeakerName = '',
        currentSpeakerId = null;

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
                {shownSegments.map((segment, index, array) => {
                    segment.speaker_is_interviewee =
                        intervieweeId === segment.speaker_id;
                    if (
                        (currentSpeakerId !== segment.speaker_id &&
                            segment.speaker_id !== null) ||
                        (currentSpeakerName !== segment.speaker &&
                            segment.speaker !== null &&
                            segment.speaker_id === null)
                    ) {
                        segment.speakerIdChanged = true;
                        currentSpeakerId = segment.speaker_id;
                        currentSpeakerName = segment.speaker;
                    }

                    const prevSegment = array[index - 1];
                    const nextSegment = array[index + 1];
                    const active =
                        interview.transcript_coupled &&
                        isSegmentActive({
                            thisSegmentTape: segment.tape_nbr,
                            thisSegmentTime: segment.time,
                            nextSegmentTape: nextSegment?.tape_nbr,
                            nextSegmentTime: nextSegment?.time,
                            currentTape: tape,
                            currentTime: mediaTime,
                        });

                    return (
                        <EditableSegment
                            key={`editable-segment-${segment.id}`}
                            segment={segment}
                            interview={interview}
                            contributor={
                                contributorInformation[segment.speaker_id]
                            }
                            contentLocale={transcriptLocale}
                            isActive={active}
                            isEditing={editingSegmentId === segment.id}
                            onEditStart={() => handleEditStart(segment.id)}
                            onEditEnd={handleEditEnd}
                            onUnsavedChangesChange={
                                setEditingSegmentHasUnsavedChanges
                            }
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
