import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SCROLL_OFFSET } from 'modules/constants';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { scrollSmoothlyTo } from 'modules/user-agent';
import { useTranscriptQueryString } from 'modules/query-string';
import { formatTimecode } from 'modules/interview-helpers';
import SegmentButtons from './SegmentButtons';
import SegmentPopup from './SegmentPopup';
import BookmarkSegmentButton from './BookmarkSegmentButton';
import Initials from './Initials';

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

    useEffect(() => {
        // Checking for divEl.current is necessary because sometimes component returns null.
        if (!divEl.current) {
            return;
        }

        if (active && !segmentParam) {
            const topOfSegment = divEl.current.offsetTop;

            // Quickfix for wrong offsetTop values.
            if (topOfSegment === 0) {
                return;
            }

            window.scrollTo(0, topOfSegment - SCROLL_OFFSET);
        } else if (segmentParam === data.id) {
            const topOfSegment = divEl.current.offsetTop;

            // Quickfix for wrong offsetTop values.
            if (topOfSegment === 0) {
                return;
            }

            window.scrollTo(0, topOfSegment - SCROLL_OFFSET);
        }
    }, []);

    useEffect(() => {
        // Checking for divEl.current is necessary because sometimes component returns null.
        if (autoScroll && active && divEl.current) {
            const topOfSegment = divEl.current.offsetTop;

            // Quickfix for wrong offsetTop values.
            if (topOfSegment === 0) {
                return;
            }

            scrollSmoothlyTo(0, topOfSegment - SCROLL_OFFSET);
        }
    }, [autoScroll, active])

    const text = isAuthorized(data, 'update') ?
        (data.text[contentLocale] || data.text[`${contentLocale}-public`]) :
        data.text[`${contentLocale}-public`];

    const showSegment = text || editView;

    const showButtons = isAuthorized(data) ||
        isAuthorized({ type: 'General' }, 'edit') ||
        (data.annotations_count + data.user_annotation_ids.length) > 0 ||
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
                    'is-active': active
                })}>
                {
                    data.speakerIdChanged && (
                        <Initials
                            initials={speakerInitials || data.speaker}
                            className={classNames('Segment-icon',
                                data.speaker_is_interviewee ? 'Segment-icon--primary' :
                                    'Segment-icon--secondary')}
                            title={speakerName || data.speaker}
                        />
                    )
                }
                <button
                    type="button"
                    className={classNames('Segment-text', { 'is-active': active })}
                    lang={contentLocale}
                    onClick={() => {transcriptCoupled && sendTimeChangeRequest(data.tape_nbr, data.time)}}
                    // TODO: clean mog segment-texts from html in db
                    //dangerouslySetInnerHTML={{__html: text}}
                >
                    {text?.replace(/&quot;/g, '"').replace(/&apos;/g, '`') || <i>{t('modules.transcript.no_text')}</i>}
                </button>

                <BookmarkSegmentButton segment={data} />

                {
                    showButtons && (
                        <SegmentButtons
                            data={data}
                            contentLocale={contentLocale}
                            popupType={popupType}
                            openPopup={openPopup}
                            closePopup={closePopup}
                            tabIndex={tabIndex}
                            active={popupType !== null}
                            sendTimeChangeRequest={sendTimeChangeRequest}
                            transcriptCoupled={transcriptCoupled}
                        />
                    )
                }
            </div>
            {
                popupType && (
                    <SegmentPopup
                        contentLocale={contentLocale}
                        data={data}
                        openReference={openReference}
                        popupType={popupType}
                        setOpenReference={setOpenReference}
                    />
                )
            }
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
};

const MemoizedSegment = memo(Segment);

export default MemoizedSegment;
