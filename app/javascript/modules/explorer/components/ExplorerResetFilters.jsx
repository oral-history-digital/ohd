import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

export function ExplorerResetFilters({ onClick }) {
    return (
        <button
            type="button"
            className="ExplorerResetFilters"
            onClick={onClick}
        >
            <FaTimes />
            Reset all filters
        </button>
    );
}

ExplorerResetFilters.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default ExplorerResetFilters;
