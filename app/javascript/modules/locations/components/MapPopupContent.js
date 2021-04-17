import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { sendTimeChangeRequest } from 'modules/media-player';

export default function MapPopupContent({ location }) {
    const { t, locale } = useI18n();
    const dispatch = useDispatch();

    if (location.ref_object) {
        return (
            <button
                type="button"
                className={classNames('button', 'button--map')}
                onClick={() => dispatch(sendTimeChangeRequest(location.ref_object.tape_number, location.ref_object.time))}
            >
                <em className='place'>
                    {location.desc[locale]}
                </em>
                {t('interview_location_desc_one')}
                <em className='chapter'>
                    {location.ref_object.last_heading[locale]}
                </em>
                {t('interview_location_desc_two')}
            </button>
        )
    } else if (location.name) {
        return (
            <div>
                {
                    location.name[locale] && (
                        <p>
                            {`${t('birth_location')}: ${location.name[locale]}`}
                        </p>
                    )
                }
                <div>
                    {`${location.names[locale].firstname} ${location.names[locale].lastname}`}
                </div>
            </div>
        )
    } else {
        return (
            <p>
                {location.desc[locale]}
            </p>
        )
    }
}

MapPopupContent.propTypes = {
    location: PropTypes.object.isRequired,
};
