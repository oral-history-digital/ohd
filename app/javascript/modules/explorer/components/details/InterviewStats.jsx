import { useI18n } from 'modules/i18n';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';

import { getInterviewAccessibilityText } from '../../utils';

function toCount(value) {
    return Number(value) || 0;
}

export function InterviewStats({ counts }) {
    const { t, locale } = useI18n();

    const {
        public: publicRaw = 0,
        restricted: restrictedRaw = 0,
        total: totalRaw = 0,
    } = counts || {};

    const totalCount = toCount(totalRaw);
    const publicCount = toCount(publicRaw);
    const restrictedCount = toCount(restrictedRaw);

    const totalStr = t(
        `activerecord.models.interview.${totalCount === 1 ? 'one' : 'other'}`
    );

    const accessibilityText = getInterviewAccessibilityText({
        totalCount,
        publicCount,
        restrictedCount,
        t,
        locale,
    });

    return (
        <div className="DescriptionList-group DescriptionList-group--interview-stats">
            <dt className="DescriptionList-term">
                {t('modules.catalog.volume')}
            </dt>
            <dd className="DescriptionList-description">
                {formatNumber(totalCount, 0, locale)} {totalStr}
                {accessibilityText ? ` (${accessibilityText})` : null}
            </dd>
        </div>
    );
}

InterviewStats.propTypes = {
    counts: PropTypes.shape({
        public: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        restricted: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
};

export default InterviewStats;
