import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaSortAmountDownAlt,
    FaSortAmountUpAlt,
    FaSortNumericDown,
    FaSortNumericUp,
} from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

export default function SortOrderButton({ className, type, value, onChange }) {
    const { t } = useI18n();

    let Icon;
    switch (type) {
        case 'amount':
            Icon = value === 'asc' ? FaSortAmountDownAlt : FaSortAmountUpAlt;
            break;
        case 'numeric':
            Icon = value === 'asc' ? FaSortNumericDown : FaSortNumericUp;
            break;
        case 'alpha':
        default:
            Icon = value === 'asc' ? FaSortAlphaDown : FaSortAlphaUp;
    }

    function handleChange() {
        onChange(value === 'asc' ? 'desc' : 'asc');
    }

    return (
        <button
            type="button"
            className={classNames('SortOrderButton', 'Button', className)}
            aria-label={t(`modules.search.sorting.order.${value}`)}
            title={t(`modules.search.sorting.order.${value}`)}
            onClick={handleChange}
        >
            <Icon className="SortOrderButton-icon" />
        </button>
    );
}

SortOrderButton.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['alpha', 'amount', 'numeric']).isRequired,
    value: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onChange: PropTypes.func.isRequired,
};
