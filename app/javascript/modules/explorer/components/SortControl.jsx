import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Dropdown } from './Dropdown';

export function SortControl({ options, value, onChange }) {
    const selected = options.find((o) => o.value === value);

    return (
        <div className="SortControl">
            <span className="SortControl-label">Sort by</span>
            <Dropdown label={selected?.label ?? ''} align="right">
                <ul className="SortControl-list">
                    {options.map((opt) => (
                        <li key={opt.value} className="SortControl-item">
                            <button
                                type="button"
                                className={classNames('SortControl-option', {
                                    'SortControl-option--active':
                                        opt.value === value,
                                })}
                                onClick={() => onChange(opt.value)}
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    );
}

SortControl.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SortControl;
