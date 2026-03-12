import PropTypes from 'prop-types';

import { INST_SORT_OPTIONS } from '../utils';

export function InstitutionsSortControl({ value, onChange }) {
    return (
        <div className="ArchivesSortControl">
            <label
                className="ArchivesSortControl-label"
                htmlFor="institutions-sort"
            >
                Sort by
            </label>
            <select
                id="institutions-sort"
                className="ArchivesSortControl-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {INST_SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

InstitutionsSortControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default InstitutionsSortControl;
