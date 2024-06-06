import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import useCollectionData from './useCollectionData';

function getMinMaxYear(dates) {
    const filteredDates = dates
        .map(d => Date.parse(d))
        .filter(d => !Number.isNaN(d));

    if (filteredDates.length === 0) {
        return null;
    }

    const minDate = new Date(Math.min(...filteredDates));
    const maxDate = new Date(Math.max(...filteredDates));

    return [minDate.getFullYear(), maxDate.getFullYear()];
}

function formatYearRange(year1, year2) {
    if (year1 === year2) {
        return `${year1}`;
    } else {
        return `${year1}–${year2}`;
    }
}

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
        return <p className={className}>{t('error')}: {error.message}</p>;
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
      .filter(mt => mt.num > 0)
      .sort((a, b) => b.num - a.num)
      .map(mt => `${mt.num} ${t('modules.catalog.' + mt.type)}`)
      .join(', ');

    return (
        <>
            {mediaTypesStr && (<>
                <dt className="DescriptionList-term">
                    {t('modules.catalog.media_type')}
                </dt>
                <dd className="DescriptionList-description">
                    {mediaTypesStr}
                </dd>
            </>)}

            {interviewYears && (<>
                <dt className="DescriptionList-term">
                    {t('modules.catalog.period')}
                </dt>
                <dd className="DescriptionList-description">
                    {formatYearRange(...interviewYears)}
                </dd>
            </>)}

            {birthYears && (<>
                <dt className="DescriptionList-term">
                    {t('modules.catalog.birthyears')}
                </dt>
                <dd className="DescriptionList-description">
                    {formatYearRange(...birthYears)}
                </dd>
            </>)}

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
