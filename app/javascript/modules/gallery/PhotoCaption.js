import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import PhotoFormContainer from './PhotoFormContainer';
import styles from './PhotoCaption.module.scss';

export default function PhotoCaption({
    photo,
    locale,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const caption = !!(photo.captions[locale] || photo.captions['de']);
    const photoExplanation = photo.captions[locale] ? '' : t('activerecord.attributes.photo.caption_explanation');

    if (isAuthorized(photo)) {
        return (<PhotoFormContainer photo={photo}/>);
    } else if (caption) {
        return (
            <div className={classNames(styles.container, 'slider-text')}>
                <p className='photo-explanation'>
                    {photoExplanation}
                </p>
                <p>
                    {photo.captions[locale] || photo.captions['de']}
                </p>
            </div>
        );
    } else {
        return null;
    }
}

PhotoCaption.propTypes = {
    photo: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};
