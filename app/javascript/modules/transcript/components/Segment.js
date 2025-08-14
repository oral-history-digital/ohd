import classNames from 'classnames';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import { useScrollOffset } from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import BookmarkSegmentButton from './BookmarkSegmentButton';
import { useAutoScrollToRef } from '../hooks';
import Initials from './Initials';
import SegmentButtons from './SegmentButtons';
import SegmentPopup from './SegmentPopup';

function Segment({
    data,
    speakerInitials,
    speakerName,
    autoScroll,
    contentLocale,
    editView,
    active,
    popupType,
    openReference,
    openPopup,
    closePopup,
    setOpenReference,
    tabIndex,
    sendTimeChangeRequest,
    transcriptCoupled,
}) {
    const divEl = useRef();
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();
    const { segment: segmentParam } = useTranscriptQueryString();
    const scrollOffset = useScrollOffset();

    const shouldScroll =
        (autoScroll && active) || // Segment is active and autoScroll is enabled (e.g. during playback)
        segmentParam === data.id || // Segment is targeted by the URL param (segmentParam === data.id)
        (active && !segmentParam && autoScroll); // Segment is initially active and autoScroll is enabled, but no segmentParam is present

    // Use custom hook for auto-scroll logic
    useAutoScrollToRef(divEl, scrollOffset, shouldScroll, [
        autoScroll,
        active,
        data.id,
        segmentParam,
    ]);

    const text = isAuthorized(data, 'update')
        ? data.text[contentLocale] || data.text[`${contentLocale}-public`]
        : data.text[`${contentLocale}-public`];

    const showSegment = text || editView;

    const showButtons =
        isAuthorized(data) ||
        isAuthorized({ type: 'General' }, 'edit') ||
        data.annotations_count + data.user_annotation_ids.length > 0 ||
        data.registry_references_count > 0;

    if (!showSegment) {
        return null;
    }

    return (
        <>
            <div
                id={`segment_${data.id}`}
                data-tape={data.tape_nbr}
                data-time={formatTimecode(data.time, true)}
                ref={divEl}
                className={classNames('Segment', {
                    'Segment--withSpeaker': data.speakerIdChanged,
                    'is-active': active,
                })}
            >
                {data.speakerIdChanged && (
                    <Initials
                        initials={speakerInitials || data.speaker}
                        className={classNames(
                            'Segment-icon',
                            data.speaker_is_interviewee
                                ? 'Segment-icon--primary'
                                : 'Segment-icon--secondary'
                        )}
                        title={speakerName || data.speaker}
                    />
                )}
                <button
                    type="button"
                    className={classNames('Segment-text', {
                        'is-active': active,
                    })}
                    lang={contentLocale}
                    dir="auto"
                    onClick={() => {
                        transcriptCoupled &&
                            sendTimeChangeRequest(data.tape_nbr, data.time);
                    }}
                    // TODO: clean mog segment-texts from html in db
                    //dangerouslySetInnerHTML={{__html: text}}
                >
                    {text?.replace(/&quot;/g, '"').replace(/&apos;/g, '`') || (
                        <i>{t('modules.transcript.no_text')}</i>
                    )}
                </button>

                <BookmarkSegmentButton segment={data} />

                {showButtons && (
                    <SegmentButtons
                        data={data}
                        contentLocale={contentLocale}
                        popupType={popupType}
                        openPopup={openPopup}
                        closePopup={closePopup}
                        tabIndex={tabIndex}
                        active={popupType !== null}
                    />
                )}
            </div>
            {popupType && (
                <SegmentPopup
                    contentLocale={contentLocale}
                    data={data}
                    openReference={openReference}
                    popupType={popupType}
                    setOpenReference={setOpenReference}
                />
            )}
        </>
    );
}

Segment.propTypes = {
    data: PropTypes.object.isRequired,
    speakerInitials: PropTypes.string,
    speakerName: PropTypes.string,
    autoScroll: PropTypes.bool.isRequired,
    editView: PropTypes.bool.isRequired,
    contentLocale: PropTypes.string.isRequired,
    popupType: PropTypes.string,
    openReference: PropTypes.object,
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    setOpenReference: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    tabIndex: PropTypes.number.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
    transcriptCoupled: PropTypes.bool.isRequired,
};

const MemoizedSegment = memo(Segment);

export default MemoizedSegment;
