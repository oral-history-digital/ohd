import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import styles from './PhotoCaption.module.scss';

export default function PhotoCaption({
    photo,
    locale,
}) {
    const { t } = useI18n();

    const caption = !!(photo.captions[locale] || photo.captions['de']);
    const photoExplanation = photo.captions[locale] ? null : t('activerecord.attributes.photo.caption_explanation');

    if (caption) {
        return (
            <div className={classNames(styles.container, 'slider-text')}>
                {
                    photoExplanation ?
                        (<p className='photo-explanation'>
                            {photoExplanation}
                        </p>) :
                        null
                }
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
