import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { formatYearRange, getMinMaxYear } from 'modules/utils';
import PropTypes from 'prop-types';

import useCollectionData from './useCollectionData';

export default function CollectionData({ id, className }) {
    const { t } = useI18n();
    const { collectionData, error, isLoading } = useCollectionData(id);

    if (isLoading) {
        return <Spinner className={className} />;
    }

    if (error) {
        return (
            <p className={className}>
                {t('error')}: {error.message}
            </p>
        );
    }

    if (!collectionData || collectionData.num_interviews === 0) {
        return null;
    }

    const interviewYears = getMinMaxYear(collectionData.interview_dates);
    const birthYears = getMinMaxYear(collectionData.birthdays);

    const mediaTypes = [
        {
            type: 'videos',
            num: collectionData.num_videos,
        },
        {
            type: 'audios',
            num: collectionData.num_audios,
        },
    ];

    const mediaTypesStr = mediaTypes
        .filter((mt) => mt.num > 0)
        .sort((a, b) => b.num - a.num)
        .map((mt) => `${mt.num} ${t('modules.catalog.' + mt.type)}`)
        .join(', ');

    return (
        <>
            {mediaTypesStr && (
                <div className="DescriptionList-group">
                    <dt className="DescriptionList-term">
                        {t('modules.catalog.media_type')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {mediaTypesStr}
                    </dd>
                </div>
            )}

            {interviewYears && (
                <div className="DescriptionList-group">
                    <dt className="DescriptionList-term">
                        {t('modules.catalog.period')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {formatYearRange(...interviewYears)}
                    </dd>
                </div>
            )}

            {birthYears && (
                <div className="DescriptionList-group">
                    <dt className="DescriptionList-term">
                        {t('modules.catalog.birthyears')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {formatYearRange(...birthYears)}
                    </dd>
                </div>
            )}
            <div className="DescriptionList-group">
                <dt className="DescriptionList-term">
                    {t('modules.catalog.languages')}
                </dt>
                <dd className="DescriptionList-description">
                    {collectionData.languages?.join(', ')}
                </dd>
            </div>
        </>
    );
}

CollectionData.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
};
