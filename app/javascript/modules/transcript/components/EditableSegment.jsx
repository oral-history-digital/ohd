import { memo, useMemo, useRef, useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import classNames from 'classnames';
import { getLocale, getProjectId, useIsEditor } from 'modules/archive';
import { useAuthorization } from 'modules/auth';
import { getCurrentProject } from 'modules/data';
import { getAutoScroll } from 'modules/interview';
import { useTranscriptQueryString } from 'modules/query-string';
import { formatTimecode } from 'modules/utils';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
    useAutoScrollToRef,
    useContentDisplay,
    useIsSegmentActive,
    useProcessedSegmentText,
    useSegmentInteraction,
    useSegmentTabs,
} from '../hooks';
import {
    Initials,
    PreviewPlayer,
    SegmentAnnotations,
    SegmentButtons,
    SegmentContentViewer,
    SegmentForm,
    SegmentRegistryReferences,
    SegmentText,
    Timecode,
} from './';

function EditableSegment({
    segment,
    interview,
    contributor,
    contentLocale,
    nextSegmentTime,
    nextSegmentTape,
    editingSegmentIdRef,
    isEditingSegment,
    onEditStart,
    onEditEnd,
    onUnsavedChangesChange,
    prevSegmentTimecode,
    nextSegmentTimecode,
}) {
    const divEl = useRef();
    const { segment: segmentParam } = useTranscriptQueryString();
    const { isAuthorized } = useAuthorization();
    const isEditviewActive = useIsEditor();
    const canEditSegment = useMemo(
        () => isAuthorized(segment, 'update'),
        [segment, isAuthorized]
    );

    const showEditTab = canEditSegment;
    const showAnnotationsTab = isAuthorized(
        { type: 'Annotation', interview_id: segment.interview_id },
        'update'
    );
    const showReferencesTab = isAuthorized(
        { type: 'RegistryReference', interview_id: segment.interview_id },
        'update'
    );

    const tabs = useSegmentTabs(
        showEditTab,
        showAnnotationsTab,
        showReferencesTab
    );

    const autoScroll = useSelector(getAutoScroll);
    const isActive = useIsSegmentActive({
        segment,
        interview,
        nextSegmentTape,
        nextSegmentTime,
        editingSegmentIdRef,
    });
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);

    const [tabIndex, setTabIndex] = useState(0);
    const {
        displayedContentType,
        handleToggleContentDisplay,
        handleCloseContentDisplay,
    } = useContentDisplay();

    const {
        handleFormChange,
        handleSubmitData,
        handleSegmentClick,
        handleEditStart,
        handleEditCancel,
        handleEditSubmit,
    } = useSegmentInteraction({
        segment,
        interview,
        tabs,
        onUnsavedChangesChange,
        onEditStart,
        onEditEnd,
        setTabIndex,
    });

    const shouldScroll =
        (autoScroll && isActive) || // Segment is active during playback (isActive is already false when any segment is being edited, via effectiveActive in Transcript)
        segmentParam === segment.id || // Segment is targeted by the URL param
        isEditingSegment; // Segment is being edited (scroll once when edit mode opens)

    // Use custom hook for auto-scroll logic
    useAutoScrollToRef(divEl, shouldScroll, [
        autoScroll,
        isActive,
        segment.id,
        segmentParam,
        isEditingSegment,
    ]);

    const { text } = useProcessedSegmentText({
        segment,
        contentLocale,
        canEditSegment,
    });

    if (!text) return null;

    return (
        <div
            id={`segment_${segment.id}`}
            data-tape={segment.tape_nbr}
            data-time={formatTimecode(segment.time, true)}
            ref={divEl}
            className={classNames('Segment', {
                'Segment--withSpeaker': segment.speakerIdChanged,
                'is-active': isActive,
                'Segment--editMode': isEditingSegment,
            })}
        >
            {isEditingSegment ? (
                <Tabs
                    className="SegmentTabs"
                    index={tabIndex}
                    onChange={setTabIndex}
                >
                    <TabList className="SegmentTabs-tabList">
                        {tabs.map((tab) => (
                            <Tab key={tab.id} className="SegmentTabs-tab">
                                {tab.label}
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanels className="SegmentTabs-panels">
                        {tabs.map((tab, index) => (
                            <TabPanel
                                key={tab.id}
                                className="SegmentTabs-panel"
                            >
                                {/* Only render tab content when active to prevent unmounted components from breaking */}
                                {tabIndex === index && tab.id === 'edit' && (
                                    <>
                                        {interview.transcript_coupled && (
                                            <PreviewPlayer
                                                segment={segment}
                                                nextSegmentTimecode={
                                                    nextSegmentTimecode
                                                }
                                            />
                                        )}
                                        <SegmentForm
                                            locale={locale}
                                            projectId={projectId}
                                            project={project}
                                            contentLocale={contentLocale}
                                            segment={segment}
                                            submitData={handleSubmitData}
                                            onSubmit={handleEditSubmit}
                                            onCancel={handleEditCancel}
                                            onChange={handleFormChange}
                                            prevSegmentTimecode={
                                                prevSegmentTimecode
                                            }
                                            nextSegmentTimecode={
                                                nextSegmentTimecode
                                            }
                                        />
                                    </>
                                )}
                                {tabIndex === index &&
                                    tab.id === 'annotations' && (
                                        <SegmentAnnotations
                                            segment={segment}
                                            contentLocale={contentLocale}
                                            onCancel={handleEditCancel}
                                        />
                                    )}
                                {tabIndex === index &&
                                    tab.id === 'references' && (
                                        <SegmentRegistryReferences
                                            segment={segment}
                                            interview={interview}
                                            onCancel={handleEditCancel}
                                        />
                                    )}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            ) : (
                <>
                    <div className="Segment-metaWrapper">
                        <Initials contributor={contributor} segment={segment} />
                        {isEditviewActive && <Timecode segment={segment} />}
                    </div>
                    <div>
                        <SegmentText
                            segment={segment}
                            locale={contentLocale}
                            isActive={isActive}
                            handleClick={handleSegmentClick}
                        />
                        {!isEditingSegment && displayedContentType && (
                            <SegmentContentViewer
                                segment={segment}
                                contentLocale={contentLocale}
                                displayedContentType={displayedContentType}
                                onClose={handleCloseContentDisplay}
                            />
                        )}
                    </div>
                </>
            )}

            <SegmentButtons
                segment={segment}
                contentLocale={contentLocale}
                onEditStart={handleEditStart}
                onViewContentType={handleToggleContentDisplay}
                isEditingSegment={isEditingSegment}
                canEditSegment={canEditSegment}
            />
        </div>
    );
}

EditableSegment.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    contributor: PropTypes.object,
    contentLocale: PropTypes.string.isRequired,
    nextSegmentTime: PropTypes.number,
    nextSegmentTape: PropTypes.number,
    editingSegmentIdRef: PropTypes.object,
    isEditingSegment: PropTypes.bool,
    onEditStart: PropTypes.func,
    onEditEnd: PropTypes.func,
    onUnsavedChangesChange: PropTypes.func,
    prevSegmentTimecode: PropTypes.string,
    nextSegmentTimecode: PropTypes.string,
};

const MemoizedSegment = memo(EditableSegment);

export default MemoizedSegment;
