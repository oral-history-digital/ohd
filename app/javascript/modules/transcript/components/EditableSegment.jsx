import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import classNames from 'classnames';
import { getLocale, getProjectId } from 'modules/archive';
import { useAuthorization } from 'modules/auth';
import { getCurrentProject, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { getAutoScroll } from 'modules/interview';
import { formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest, useScrollOffset } from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useAutoScrollToRef } from '../hooks';
import { checkTextDir, enforceRtlOnTranscriptTokens } from '../utils';
import {
    BookmarkSegmentButton,
    Initials,
    SegmentButtons,
    SegmentForm,
    SegmentText,
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
        ({ isDirty }) => {
            onUnsavedChangesChange?.(isDirty);
            // dirtyFields is available if needed for more granular control
        },
        [onUnsavedChangesChange]
    );

    const shouldScroll =
        (autoScroll && isActive) || // Segment is active and autoScroll is enabled (e.g. during playback)
        segmentParam === segment.id || // Segment is targeted by the URL param (segmentParam === data.id)
        (isActive && !segmentParam && autoScroll); // Segment is initially active and autoScroll is enabled, but no segmentParam is present

    // Use custom hook for auto-scroll logic
    useAutoScrollToRef(divEl, scrollOffset, shouldScroll, [
        autoScroll,
        isActive,
        segment.id,
        segmentParam,
    ]);

    const handleSegmentClick = () => {
        if (interview?.transcriptCoupled && !isEditing) {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
    };

    const handleEditStart = (buttonType = 'edit') => {
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

    const showButtons =
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
    const tabs = useMemo(() => {
        const tabsArray = [];
        if (showEditTab) {
            tabsArray.push({
                id: 'edit',
                label: t('edit'),
                content: (
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
                        includeTimecode
                    />
                ),
            });
        }
        if (showAnnotationsTab) {
            tabsArray.push({
                id: 'annotations',
                label: t('activerecord.models.annotation.other'),
                content: (
                    <div className="EditableSegment-tabContent">
                        <p>{t('activerecord.models.annotation.other')}</p>
                        <p>Annotations UI will be implemented here</p>
                    </div>
                ),
            });
        }
        if (showReferencesTab) {
            tabsArray.push({
                id: 'references',
                label: t('activerecord.models.registry_reference.other'),
                content: (
                    <div className="EditableSegment-tabContent">
                        <p>
                            {t('activerecord.models.registry_reference.other')}
                        </p>
                        <p>Registry References UI will be implemented here</p>
                    </div>
                ),
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
                        {tabs.map((tab) => (
                            <TabPanel
                                key={tab.id}
                                className="SegmentTabs-panel"
                            >
                                {tab.content}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            ) : (
                <>
                    <Initials contributor={contributor} segment={segment} />
                    <SegmentText
                        segment={segment}
                        locale={contentLocale}
                        isActive={isActive}
                        handleClick={handleSegmentClick}
                    />
                    <BookmarkSegmentButton segment={segment} />
                </>
            )}

            {!isEditing && showButtons && (
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
};

const MemoizedSegment = memo(EditableSegment);

export default MemoizedSegment;
