import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { fullname } from 'modules/people';
import { useAuthorization } from 'modules/auth';
import SegmentButtonsContainer from './SegmentButtonsContainer';

export default function Segment({
    data,
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
    const { isAuthorized } = useAuthorization();

    const text = isAuthorized(data) ?
        (data.text[contentLocale] || data.text[`${contentLocale}-public`]) :
        (data.text[`${contentLocale}-public`] || '');

    return (
        <div
            className={classNames('Segment', {
                'Segment--withSpeaker': data.speakerIdChanged,
            })}>
            {
                data.speakerIdChanged && (
                    <i
                        className={classNames('Segment-icon', 'fa', data.speaker_is_interviewee ? 'fa-user' : 'fa-user-o')}
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
                {text}
            </button>

            <SegmentButtonsContainer
                data={data}
                contentLocale={contentLocale}
                popupType={popupType}
                openReference={openReference}
                openPopup={openPopup}
                closePopup={closePopup}
                setOpenReference={setOpenReference}
                tabIndex={tabIndex}
                active={active}
            />
        </div>
    );
}

Segment.propTypes = {
    data: PropTypes.object.isRequired,
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
