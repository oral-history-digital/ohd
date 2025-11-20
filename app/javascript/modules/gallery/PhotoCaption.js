import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';

export default function PhotoCaption({ className, photo }) {
    const { t, locale } = useI18n();

    const caption = photo.captions[locale] || photo.captions['de'];
    const photoExplanation = photo.captions[locale]
        ? null
        : t('activerecord.attributes.photo.caption_explanation');

    const translations =
        photo.translations_attributes.find((t) => t.locale === locale) ||
        photo.translations_attributes[0] ||
        {};

    return (
        <div className={classNames('PhotoCaption', 'slider-text', className)}>
            {photoExplanation && (
                <p className="photo-explanation">{photoExplanation}</p>
            )}
            <h3 className="PhotoCaption-heading">{caption}</h3>

            <ul className="PhotoCaption-list">
                {translations.place && (
                    <li className="PhotoCaption-listItem">
                        {t('activerecord.attributes.photo.place')}:{' '}
                        {translations.place}
                    </li>
                )}
                {translations.date && (
                    <li className="PhotoCaption-listItem">
                        {t('activerecord.attributes.photo.date')}:{' '}
                        {translations.date}
                    </li>
                )}
                {translations.photographer && (
                    <li className="PhotoCaption-listItem">
                        {t('activerecord.attributes.photo.photographer')}:{' '}
                        {translations.photographer}
                    </li>
                )}
                {translations.license && (
                    <li className="PhotoCaption-listItem">
                        {t('activerecord.attributes.photo.license')}:{' '}
                        {translations.license}
                    </li>
                )}
                {photo.public_id && (
                    <li className="PhotoCaption-listItem">
                        {t('activerecord.attributes.photo.public_id')}:{' '}
                        {photo.public_id}
                    </li>
                )}
            </ul>
        </div>
    );
}

PhotoCaption.propTypes = {
    className: PropTypes.string,
    photo: PropTypes.object.isRequired,
};
