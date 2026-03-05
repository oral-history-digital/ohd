import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import {
    getCurrentTape,
    getIsIdle,
    togglePlayerWidth,
} from 'modules/media-player';
import { useInterviewContributors } from 'modules/person';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
    EditableSegment,
    TranscriptSkeleton,
    UnsavedChangesDialog,
} from './components';
import { useProcessedSegments } from './hooks';
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

    // Track which segment is currently being edited
    const [editingSegmentId, setEditingSegmentId] = useState(null);
    const [
        editingSegmentHasUnsavedChanges,
        setEditingSegmentHasUnsavedChanges,
    ] = useState(false);

    // Stable ref so EditableSegment can read whether any segment is being
    // edited without subscribing to it as a prop (which would cause all
    // segments to re-render when one edit opens/closes).
    const editingSegmentIdRef = useRef(editingSegmentId);
    editingSegmentIdRef.current = editingSegmentId;

    // Ref keeps the latest editing state readable inside stable callbacks
    // without listing them as deps (which would create a new function on every
    // edit-state change and defeat memo() on all segments).
    const editingStateRef = useRef({
        editingSegmentId,
        editingSegmentHasUnsavedChanges,
    });
    editingStateRef.current = {
        editingSegmentId,
        editingSegmentHasUnsavedChanges,
    };

    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

    const handleEditStart = useCallback(
        (segmentId) => {
            const {
                editingSegmentId: currentId,
                editingSegmentHasUnsavedChanges: hasUnsaved,
            } = editingStateRef.current;
            if (currentId !== null && hasUnsaved) {
                setShowUnsavedWarning(true);
                return false;
            }
            togglePlayerWidth(true); // Switch to compact player when editing starts
            setEditingSegmentId(segmentId);
            setEditingSegmentHasUnsavedChanges(false);
            return true;
        },
        [] // no deps — all mutable values are read from editingStateRef; setters are stable
    );

    const handleEditEnd = useCallback(() => {
        setEditingSegmentId(null);
        setEditingSegmentHasUnsavedChanges(false);
    }, []);

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
            <UnsavedChangesDialog
                isOpen={showUnsavedWarning}
                onDismiss={() => setShowUnsavedWarning(false)}
            />
            <div
                className={classNames('Transcript', {
                    'Transcript--rtl': isRtlLanguage(transcriptLocale),
                })}
            >
                {processedSegments.map((segment, index, array) => {
                    const prevSegment = array[index - 1];
                    const nextSegment = array[index + 1];

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
                            isEditingSegment={
                                isEditviewActive &&
                                editingSegmentId === segment.id
                            }
                            editingSegmentIdRef={editingSegmentIdRef}
                            onEditStart={handleEditStart}
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
