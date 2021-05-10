import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaUser } from 'react-icons/fa';

import { fullname } from 'modules/people';
import { MEDIA_PLAYER_HEIGHT_STICKY, CONTENT_TABS_HEIGHT } from 'modules/constants';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { scrollSmoothlyTo } from 'modules/user-agent';
import SegmentButtonsContainer from './SegmentButtonsContainer';
import SegmentPopupContainer from './SegmentPopupContainer';

const SPACE_BEFORE_ACTIVE_SEGMENT = 48;
const SCROLL_OFFSET = MEDIA_PLAYER_HEIGHT_STICKY + CONTENT_TABS_HEIGHT + SPACE_BEFORE_ACTIVE_SEGMENT;

export default function Segment({
    data,
    autoScroll,
    contentLocale,
    locale,
    active,
    people,
    popupType,
    openReference,
    openPopup,
    closePopup,
    setOpenReference,
    tabIndex,
    sendTimeChangeRequest,
}) {
    const divEl = useRef(null);
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();

    useEffect(() => {
        if (autoScroll && active) {
            const topOfSegment = divEl.current.offsetTop;

            scrollSmoothlyTo(0, topOfSegment - SCROLL_OFFSET);
        }
    }, [autoScroll, active])

    const text = isAuthorized(data) ?
        (data.text[contentLocale] || data.text[`${contentLocale}-public`]) :
        data.text[`${contentLocale}-public`];

    const showButtons = isAuthorized(data) ||
        isAuthorized({ type: 'General', action: 'edit' }) ||
        (data.annotations_count + data.user_annotation_ids.length) > 0 ||
        data.registry_references_count > 0;

    return (
        <>
            <div
                id={`segment_${data.id}`}
                ref={divEl}
                className={classNames('Segment', {
                    'Segment--withSpeaker': data.speakerIdChanged,
                })}>
                {
                    data.speakerIdChanged && (
                        <FaUser
                            className={classNames('Segment-icon', data.speaker_is_interviewee ? 'Segment-icon--primary' : 'Segment-icon--secondary')}
                            title={(people && data.speaker_id) ? fullname({ locale }, people[data.speaker_id]) : data.speaker}
                        />
                    )
                }
                <button
                    type="button"
                    className={classNames('Segment-text', {
                        'is-active': active,
                    })}
                    lang={contentLocale}
                    onClick={() => sendTimeChangeRequest(data.tape_nbr, data.time)}
                    // TODO: clean mog segment-texts from html in db
                    //dangerouslySetInnerHTML={{__html: text}}
                >
                    {text || <i>{t('modules.transcript.no_text')}</i>}
                </button>

                {
                    showButtons && (
                        <SegmentButtonsContainer
                            data={data}
                            contentLocale={contentLocale}
                            popupType={popupType}
                            openPopup={openPopup}
                            closePopup={closePopup}
                            tabIndex={tabIndex}
                            active={popupType !== null}
                        />
                    )
                }
            </div>
            {
                popupType && (
                    <SegmentPopupContainer
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
    autoScroll: PropTypes.bool.isRequired,
    contentLocale: PropTypes.string.isRequired,
    popupType: PropTypes.string,
    openReference: PropTypes.object,
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    setOpenReference: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    people: PropTypes.object.isRequired,
    tabIndex: PropTypes.number.isRequired,
    locale: PropTypes.string.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
