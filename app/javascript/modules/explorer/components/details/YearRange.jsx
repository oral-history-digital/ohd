import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { formatYearRange } from '../../utils';

export function YearRange({ years, labelKey, className }) {
    const { t } = useI18n();

    const minYear = Number(years?.min);
    const maxYear = Number(years?.max);
    const hasYearRange = Number.isFinite(minYear) && Number.isFinite(maxYear);

    if (!hasYearRange) {
        return null;
    }

    return (
        <div
            className={classNames(
                'DescriptionList-group',
                'DescriptionList-group--year-range',
                className
            )}
        >
            {labelKey && (
                <dt className="DescriptionList-term">{t(labelKey)}</dt>
            )}
            <dd className="DescriptionList-description">
                {formatYearRange(minYear, maxYear)}
            </dd>
        </div>
    );
}

YearRange.propTypes = {
    years: PropTypes.shape({
        min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    labelKey: PropTypes.string,
    className: PropTypes.string,
};

export default YearRange;
