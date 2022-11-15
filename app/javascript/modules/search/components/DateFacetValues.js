import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function DateFacetValues({
    data,
    className
}) {
    const { locale } = useI18n();

    const values = Object.keys(data.values)
        .map(dateStr => new Date(dateStr));

    if (values.length === 0) {
        return (
            <p>keine Werte</p>
        );
    }

    const minDate = new Date(Math.min(...values));
    const maxDate = new Date(Math.max(...values));

    return (
        <p className={className}>
            {values.length} Ereignisse von
            {' '}
            {minDate.toLocaleDateString(locale, { dateStyle: 'medium' })}
            {' '}
            bis
            {' '}
            {maxDate.toLocaleDateString(locale, { dateStyle: 'medium' })}
        </p>
    );
}

DateFacetValues.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
};
