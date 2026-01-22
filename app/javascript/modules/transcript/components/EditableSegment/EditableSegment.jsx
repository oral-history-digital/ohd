import { memo, useRef, useState } from 'react';

import classNames from 'classnames';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { getAutoScroll } from 'modules/interview';
import { formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest, useScrollOffset } from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import { CancelButton, SubmitButton } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { useAutoScrollToRef } from '../../hooks';
import { checkTextDir, enforceRtlOnTranscriptTokens } from '../../utils';
import BookmarkSegmentButton from '../BookmarkSegmentButton';
import EditableSegmentText from './EditableSegmentText';
import EditableTimecode from './EditableTimecode';
import Initials from './Initials';
import SegmentButtons from './SegmentButtons';
import SegmentText from './SegmentText';

function Segment({ segment, interview, contributor, contentLocale, isActive }) {
    const divEl = useRef();
    const { t } = useI18n();
    const { segment: segmentParam } = useTranscriptQueryString();
    const scrollOffset = useScrollOffset();
    const { isAuthorized } = useAuthorization();

    const autoScroll = useSelector(getAutoScroll);
    const dispatch = useDispatch();

    const [activeButton, setActiveButton] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedText, setEditedText] = useState(null);
    const [editedTimecode, setEditedTimecode] = useState(null);

    console.log('activeButton:', activeButton);

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
        if (interview?.transcriptCoupled && !editMode) {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
    };

    const handleEditStart = () => {
        setEditMode(true);
        setEditedText(null); // Start with original text
        setEditedTimecode(null); // Start with original time
        setActiveButton('edit');
    };

    const handleEditCancel = () => {
        setEditMode(false);
        setEditedText(null);
        setEditedTimecode(null);
        setActiveButton(null);
    };

    const handleEditSave = async () => {
        // TODO: Implement save logic
        console.log('Saving segment text:', editedText);
        console.log('Saving segment time:', editedTimecode);
        setEditMode(false);
        setEditedText(null);
        setEditedTimecode(null);
        setActiveButton(null);
    };

    let text = isAuthorized(segment, 'update')
        ? segment.text[contentLocale] || segment.text[`${contentLocale}-public`]
        : segment.text[`${contentLocale}-public`];

    const textDir = checkTextDir(text);
    // Enforce RTL wrapping if the text direction is RTL
    text = textDir === 'rtl' ? enforceRtlOnTranscriptTokens(text) : text;

    const showButtons =
        isAuthorized(segment) || isAuthorized({ type: 'General' }, 'edit');

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
                'Segment--editMode': editMode,
            })}
            style={{ background: '#f8f8f8' }}
        >
            {editMode ? (
                <>
                    <EditableSegmentText
                        segment={segment}
                        locale={contentLocale}
                        originalText={text}
                        editedText={editedText}
                        onTextChange={setEditedText}
                    />
                    <EditableTimecode
                        segment={segment}
                        editedTime={editedTimecode}
                        onTimeChange={setEditedTimecode}
                    />
                    <div className="EditableSegment-actions">
                        <CancelButton
                            handleCancel={handleEditCancel}
                            variant="outlined"
                            color="secondary"
                            startIcon={<FaTimes className="Icon" />}
                            title={t('button.cancel')}
                            className="Button--icon"
                        />
                        <SubmitButton
                            variant="contained"
                            color="primary"
                            onClick={handleEditSave}
                            startIcon={<FaCheck className="Icon" />}
                            title={t('button.save')}
                            className="Button--icon"
                        />
                    </div>
                </>
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

            {!editMode && showButtons && (
                <SegmentButtons
                    segment={segment}
                    setActiveButton={setActiveButton}
                    onEditStart={handleEditStart}
                />
            )}
        </div>
    );
}

Segment.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    contributor: PropTypes.object,
    contentLocale: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
};

const MemoizedSegment = memo(Segment);

export default MemoizedSegment;
