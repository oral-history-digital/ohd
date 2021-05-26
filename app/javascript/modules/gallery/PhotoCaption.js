import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import PhotoMetadatum from './PhotoMetadatum';

const metadata = [
    'place',
    'date',
    'photographer',
    'license',
];

export default function PhotoCaption({
    photo,
    locale,
}) {
    const { t } = useI18n();

    const caption = photo.captions[locale] || photo.captions['de'];
    const photoExplanation = photo.captions[locale] ? null : t('activerecord.attributes.photo.caption_explanation');

    const translations = photo.translations.find(t => t.locale === locale);

    return (
        <div className={classNames('PhotoCaption', 'slider-text')}>
            {
                photoExplanation ?
                    (<p className='photo-explanation'>
                        {photoExplanation}
                    </p>) :
                    null
            }
            <p className="PhotoCaption-paragraph">{caption}</p>

            {
                translations && metadata.map(metadatum => {
                    if (!translations[metadatum]) {
                        return null;
                    }

                    return (<PhotoMetadatum
                        key={metadatum}
                        className="PhotoCaption-paragraph"
                        label={metadatum}
                        value={translations[metadatum]}
                    />);
                })
            }
        </div>
    );
}

PhotoCaption.propTypes = {
    photo: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};
