import PropTypes from 'prop-types';

import { SORT_OPTIONS } from '../utils';

export function ArchivesSortControl({ value, onChange }) {
    return (
        <div className="ArchivesSortControl">
            <label
                className="ArchivesSortControl-label"
                htmlFor="archives-sort"
            >
                Sort by
            </label>
            <select
                id="archives-sort"
                className="ArchivesSortControl-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

ArchivesSortControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ArchivesSortControl;
