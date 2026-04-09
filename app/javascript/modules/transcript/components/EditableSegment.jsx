import { memo, useMemo, useRef, useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import classNames from 'classnames';
import { getLocale, getProjectId, useIsEditor } from 'modules/archive';
import { useAuthorization } from 'modules/auth';
import { getCurrentProject } from 'modules/data';
import { getAutoScroll } from 'modules/interview';
import { getScrollOffset } from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import { SegmentHeadingForm } from 'modules/toc';
import { scrollSmoothlyTo } from 'modules/user-agent';
import { formatTimecode, timecodeToSeconds } from 'modules/utils';
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
    UnsavedChangesDialog,
} from './';

function EditableSegment({
    segment,
    interview,
    contributor,
    contentLocale,
    nextSegmentTime,
    nextSegmentTape,
    segmentEditing,
    isEditingSegment,
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
    const showHeadingsTab = canEditSegment;
    const showAnnotationsTab = isAuthorized(
        { type: 'Annotation', interview_id: segment.interview_id },
        'update'
    );
    const showReferencesTab = isAuthorized(
        { type: 'RegistryReference', interview_id: segment.interview_id },
        'update'
    );

    const {
        editingSegmentIdRef,
        showUnsavedWarning,
        dismissUnsavedWarning,
        continueAfterUnsavedWarning,
        handleUnsavedChangesAttempt,
        handleEditStart: handleStartEditing,
        handleEditEnd: handleEndEditing,
        setEditingSegmentHasUnsavedChanges,
    } = segmentEditing;

    const tabs = useSegmentTabs(
        showEditTab,
        showHeadingsTab,
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

    const scrollToSegment = () => {
        if (!divEl.current) return;
        const topOfElement = divEl.current.offsetTop;
        if (topOfElement === 0) return;
        scrollSmoothlyTo(0, topOfElement - getScrollOffset());
    };

    const handleUnsavedDismiss = () => {
        dismissUnsavedWarning();
        requestAnimationFrame(scrollToSegment);
    };

    const handleUnsavedContinue = () => {
        continueAfterUnsavedWarning();
        requestAnimationFrame(scrollToSegment);
    };

    const handleTabChange = (nextTabIndex) => {
        const currentTabId = tabs[tabIndex]?.id;
        const nextTabId = tabs[nextTabIndex]?.id;
        const tabUnmountsForm =
            currentTabId === 'edit' || currentTabId === 'headings';

        // Leaving edit/headings tab unmounts a form; block it when unsaved changes exist.
        if (
            tabUnmountsForm &&
            nextTabId !== currentTabId &&
            handleUnsavedChangesAttempt &&
            !handleUnsavedChangesAttempt(() => setTabIndex(nextTabIndex))
        ) {
            return;
        }

        setTabIndex(nextTabIndex);
    };

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
        onUnsavedChangesChange: setEditingSegmentHasUnsavedChanges,
        onEditStart: handleStartEditing,
        onEditEnd: handleEndEditing,
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
            data-time={formatTimecode(
                timecodeToSeconds(segment.timecode),
                true
            )}
            ref={divEl}
            className={classNames('Segment', {
                'Segment--withSpeaker': segment.speakerIdChanged,
                'is-active': isActive,
                'Segment--editMode': isEditingSegment,
                'Segment--isEditor': isEditviewActive,
            })}
        >
            {isEditingSegment ? (
                <Tabs
                    className="SegmentTabs"
                    index={tabIndex}
                    onChange={handleTabChange}
                >
                    <TabList className="SegmentTabs-tabList">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.id}
                                className="SegmentTabs-tab"
                                data-testid={`segment-tab-${tab.id}`}
                            >
                                {tab.label}
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanels className="SegmentTabs-panels">
                        {tabs.map((tab, index) => (
                            <TabPanel
                                key={tab.id}
                                className="SegmentTabs-panel"
                                data-testid={`segment-panel-${tab.id}`}
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
                                            data-testid="segment-form"
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
                                    tab.id === 'headings' && (
                                        <SegmentHeadingForm
                                            segment={segment}
                                            onSubmit={handleEditSubmit}
                                            onCancel={handleEditCancel}
                                            onChange={handleFormChange}
                                            data-testid="segment-headings"
                                            submitText="save"
                                            cancelText="close"
                                        />
                                    )}
                                {tabIndex === index &&
                                    tab.id === 'annotations' && (
                                        <SegmentAnnotations
                                            segment={segment}
                                            contentLocale={contentLocale}
                                            onCancel={handleEditCancel}
                                            data-testid="segment-annotations"
                                        />
                                    )}
                                {tabIndex === index &&
                                    tab.id === 'references' && (
                                        <SegmentRegistryReferences
                                            segment={segment}
                                            interview={interview}
                                            onCancel={handleEditCancel}
                                            data-testid="segment-references"
                                        />
                                    )}
                            </TabPanel>
                        ))}
                    </TabPanels>
                    <UnsavedChangesDialog
                        isOpen={isEditingSegment && showUnsavedWarning}
                        onDismiss={handleUnsavedDismiss}
                        onContinue={handleUnsavedContinue}
                    />
                </Tabs>
            ) : (
                <>
                    <div className="Segment-metaWrapper">
                        <Initials contributor={contributor} segment={segment} />
                        {isEditviewActive && <Timecode segment={segment} />}
                    </div>
                    <div className="Segment-content">
                        <SegmentText
                            segment={segment}
                            locale={contentLocale}
                            isActive={isActive}
                            handleClick={handleSegmentClick}
                        />
                        {!isEditingSegment && displayedContentType && (
                            <SegmentContentViewer
                                segment={segment}
                                interview={interview}
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
    segmentEditing: PropTypes.shape({
        editingSegmentIdRef: PropTypes.object,
        showUnsavedWarning: PropTypes.bool,
        dismissUnsavedWarning: PropTypes.func,
        continueAfterUnsavedWarning: PropTypes.func,
        handleUnsavedChangesAttempt: PropTypes.func,
        handleEditStart: PropTypes.func,
        handleEditEnd: PropTypes.func,
        setEditingSegmentHasUnsavedChanges: PropTypes.func,
    }).isRequired,
    isEditingSegment: PropTypes.bool,
    prevSegmentTimecode: PropTypes.string,
    nextSegmentTimecode: PropTypes.string,
};

const MemoizedSegment = memo(EditableSegment);

export default MemoizedSegment;
