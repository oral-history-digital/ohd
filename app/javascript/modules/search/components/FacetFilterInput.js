import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaSearch } from 'react-icons/fa';

const FACET_FILTER_MIN_ITEMS = 10;

export default function FacetFilterInput({ data, facet, filter, onChange }) {
    if (Object.keys(data.subfacets).length < FACET_FILTER_MIN_ITEMS) {
        return null;
    }

    function handleKeyDown(event) {
        // Prevent form from being submitted?
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    }

    return (
        <div className="facet-filter">
            <FaSearch className="Icon Icon--primary Icon--small" />
            <input
                type="text"
                className={classNames('filter', facet)}
                value={filter}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                style={{ borderBottom: '1px solid ', marginBottom: '0.7rem' }}
            />
        </div>
    );
}

FacetFilterInput.propTypes = {
    data: PropTypes.object.isRequired,
    facet: PropTypes.string.isRequired,
    filter: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
