import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import useCollectionData from './useCollectionData';

export default function CollectionData({
    id,
    className
}) {
    const { t, locale } = useI18n();
    const { collectionData, error, isLoading } = useCollectionData(id);

    if (isLoading) {
        return <Spinner className={className} />;
    }

    if (error) {
        return <p className={className}>{t('error')}: {error}</p>;
    }

    if (!collectionData || collectionData.num_interviews === 0) {
        return null;
    }

    const dateMin = collectionData.date_min ?
        (new Date(collectionData.date_min)).toLocaleDateString(locale, { dateStyle: 'medium' }) :
        null;
    const dateMax = collectionData.date_max ?
        (new Date(collectionData.date_max)).toLocaleDateString(locale, { dateStyle: 'medium' }) :
        null;

    const birthdays = collectionData.birthdays
        .map(d => Date.parse(d))
        .filter(d => !Number.isNaN(d));
    const minBirthday = birthdays.length > 0 ?
        new Date(Math.min(...birthdays)) :
        null;
    const maxBirthday = birthdays.length > 0 ?
        new Date(Math.max(...birthdays)) :
        null;

    return (
        <>
            <dt className="DescriptionList-term">
                {t('modules.catalog.media_type')}
            </dt>
            <dd className="DescriptionList-description">
                {t('modules.catalog.videos', { numVideos: collectionData.num_videos })}
                {', '}
                {t('modules.catalog.audios', { numAudios: collectionData.num_audios })}
            </dd>

            <dt className="DescriptionList-term">
                {t('modules.catalog.period')}
            </dt>
            <dd className="DescriptionList-description">
                {dateMin}–{dateMax}
            </dd>

            <dt className="DescriptionList-term">
                {t('modules.catalog.birthyears')}
            </dt>
            <dd className="DescriptionList-description">
                {minBirthday?.getFullYear()}–{maxBirthday?.getFullYear()}
            </dd>

            <dt className="DescriptionList-term">
                {t('modules.catalog.languages')}
            </dt>
            <dd className="DescriptionList-description">
                {collectionData.languages?.join(', ')}
            </dd>
        </>
    );
}

CollectionData.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
};
