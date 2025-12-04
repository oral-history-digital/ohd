import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function DateCell({ getValue }) {
    const { locale } = useI18n();

    const date = new Date(getValue());

    const shortDate = date.toLocaleDateString(locale, { dateStyle: 'medium' });
    const longDate = date.toLocaleString(locale);
    const dateTime =
        shortDate === 'Invalid Date' ? '' : date.toISOString().split('T')[0];

    return (
        <time dateTime={dateTime} title={longDate}>
            {shortDate}
        </time>
    );
}

DateCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};
