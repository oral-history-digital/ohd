import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import classNames from 'classnames';
import { getLocale, getProjectId } from 'modules/archive';
import { useAuthorization } from 'modules/auth';
import { getCurrentProject, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { getAutoScroll } from 'modules/interview';
import {
    sendTimeChangeRequest,
    updateIsPlaying,
    useScrollOffset,
} from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import { formatTimecode } from 'modules/utils';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useAutoScrollToRef } from '../hooks';
import { checkTextDir, enforceRtlOnTranscriptTokens } from '../utils';
import {
    BookmarkSegmentButton,
    Initials,
    SegmentAnnotations,
    SegmentButtons,
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
    isActive,
    isEditing,
    onEditStart,
    onEditEnd,
    onUnsavedChangesChange,
    prevSegmentTimecode,
    nextSegmentTimecode,
}) {
    const divEl = useRef();
    const { t } = useI18n();
    const { segment: segmentParam } = useTranscriptQueryString();
    const scrollOffset = useScrollOffset();
    const { isAuthorized } = useAuthorization();

    const autoScroll = useSelector(getAutoScroll);
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);
    const dispatch = useDispatch();

    const [activeButton, setActiveButton] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const handleFormChange = useCallback(
        ({ isDirty, hasValidationErrors }) => {
            onUnsavedChangesChange?.(isDirty || hasValidationErrors);
            // dirtyFields is available if needed for more granular control
        },
        [onUnsavedChangesChange]
    );

    const shouldScroll =
        (autoScroll && isActive) || // Segment is active and autoScroll is enabled (e.g. during playback)
        segmentParam === segment.id || // Segment is targeted by the URL param (segmentParam === data.id)
        (isActive && !segmentParam && autoScroll) || // Segment is initially active and autoScroll is enabled, but no segmentParam is present
        isEditing; // Segment is being edited

    // Use custom hook for auto-scroll logic
    useAutoScrollToRef(divEl, scrollOffset, shouldScroll, [
        autoScroll,
        isActive,
        segment.id,
        segmentParam,
        isEditing,
    ]);

    const handleSegmentClick = () => {
        if (interview?.transcript_coupled) {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
    };

    const handleEditStart = (buttonType = 'edit') => {
        // Stop playback when entering edit mode
        dispatch(updateIsPlaying(false));
        // Jump to this segment's time when entering edit mode
        if (interview?.transcript_coupled) {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
        onEditStart?.();
        setActiveButton(buttonType);
    };

    const handleEditCancel = useCallback(() => {
        onEditEnd?.();
        setActiveButton(null);
    }, [onEditEnd]);

    const handleEditSubmit = useCallback(() => {
        onEditEnd?.();
        setActiveButton(null);
    }, [onEditEnd]);

    let text = isAuthorized(segment, 'update')
        ? segment.text[contentLocale] || segment.text[`${contentLocale}-public`]
        : segment.text[`${contentLocale}-public`];

    const textDir = checkTextDir(text);
    // Enforce RTL wrapping if the text direction is RTL
    text = textDir === 'rtl' ? enforceRtlOnTranscriptTokens(text) : text;

    const showButtonsAndTimecodes =
        isAuthorized(segment) || isAuthorized({ type: 'General' }, 'edit');

    const showEditTab = isAuthorized(segment, 'update');
    const showAnnotationsTab = isAuthorized(
        { type: 'Annotation', interview_id: segment.interview_id },
        'update'
    );
    const showReferencesTab = isAuthorized(
        { type: 'RegistryReference', interview_id: segment.interview_id },
        'update'
    );

    // Build tabs array based on permissions
    // Note: segment is intentionally NOT in dependencies - we want stable tab structure
    // but the segment prop will flow through to child components on re-render
    const tabs = useMemo(() => {
        const tabsArray = [];
        if (showEditTab) {
            tabsArray.push({
                id: 'edit',
                label: t('edit.segment.tab_edit'),
            });
        }
        if (showAnnotationsTab) {
            tabsArray.push({
                id: 'annotations',
                label: t('edit.segment.tab_annotations'),
            });
        }
        if (showReferencesTab) {
            tabsArray.push({
                id: 'references',
                label: t('edit.segment.tab_registry_references'),
            });
        }
        return tabsArray;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEditTab, showAnnotationsTab, showReferencesTab]);

    // Sync tabIndex with activeButton based on dynamic tabs array
    useEffect(() => {
        if (activeButton) {
            const index = tabs.findIndex((tab) => tab.id === activeButton);
            if (index !== -1) {
                setTabIndex(index);
            }
        }
    }, [activeButton, tabs]);

    if (!text) {
        return null;
    }

    return (
        <div
            id={`segment_${segment.id}`}
            data-tape={segment.tape_nbr}
            data-time={formatTimecode(segment.time, true)}
            ref={divEl}
            className={classNames('Segment', {
                'Segment--withSpeaker': segment.speakerIdChanged,
                'is-active': isActive,
                'Segment--editMode': isEditing,
            })}
        >
            {isEditing ? (
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
                                    <SegmentForm
                                        locale={locale}
                                        projectId={projectId}
                                        project={project}
                                        contentLocale={contentLocale}
                                        segment={segment}
                                        submitData={(props, params) => {
                                            dispatch(submitData(props, params));
                                        }}
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
                        {showButtonsAndTimecodes && (
                            <Timecode segment={segment} />
                        )}
                    </div>
                    <SegmentText
                        segment={segment}
                        locale={contentLocale}
                        isActive={isActive}
                        handleClick={handleSegmentClick}
                    />
                    <BookmarkSegmentButton segment={segment} />
                </>
            )}

            {!isEditing && showButtonsAndTimecodes && (
                <SegmentButtons
                    segment={segment}
                    setActiveButton={setActiveButton}
                    onEditStart={handleEditStart}
                />
            )}
        </div>
    );
}

EditableSegment.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    contributor: PropTypes.object,
    contentLocale: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    isEditing: PropTypes.bool,
    onEditStart: PropTypes.func,
    onEditEnd: PropTypes.func,
    onUnsavedChangesChange: PropTypes.func,
    prevSegmentTimecode: PropTypes.string,
    nextSegmentTimecode: PropTypes.string,
};

const MemoizedSegment = memo(EditableSegment);

export default MemoizedSegment;
