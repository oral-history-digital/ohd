import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

export default function RowExpander({ row }) {
    return row.getCanExpand() ? (
        <button
            type="button"
            className="Button Button--transparent Button--icon"
            onClick={row.getToggleExpandedHandler()}
        >
            {row.getIsExpanded() ? (
                <FaMinus className="Icon" />
            ) : (
                <FaPlus className="Icon" />
            )}
        </button>
    ) : null;
}

RowExpander.propTypes = {
    row: PropTypes.object.isRequired,
};
