import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

export function ExplorerResetFilters({ onClick }) {
    const { t } = useI18n();

    return (
        <button
            type="button"
            className="ExplorerResetFilters"
            onClick={onClick}
        >
            <FaTimes />
            {t('explorer.reset_all_filters')}
        </button>
    );
}

ExplorerResetFilters.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default ExplorerResetFilters;
