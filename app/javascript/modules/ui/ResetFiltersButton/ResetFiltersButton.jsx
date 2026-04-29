import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

export function ResetFiltersButton({ onClick, buttonText, className }) {
    const { t } = useI18n();

    return (
        <button
            type="button"
            className={`ResetFiltersButton ${className}`}
            onClick={onClick}
            data-testid="reset-filters-button"
        >
            <FaTimes />
            {buttonText || t('reset_filters')}
        </button>
    );
}

ResetFiltersButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
    className: PropTypes.string,
};

export default ResetFiltersButton;
