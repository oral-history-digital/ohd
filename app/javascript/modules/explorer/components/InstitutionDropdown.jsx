import PropTypes from 'prop-types';

import { Dropdown } from './Dropdown';

export function InstitutionDropdown({
    institutions,
    values,
    onChange,
    onClearAll,
}) {
    const hasSelection = values.length > 0;

    const toggleLabel = hasSelection
        ? values.length === 1
            ? institutions.find((i) => i.id === values[0])?.name
            : `${values.length} institutions`
        : 'All institutions';

    return (
        <Dropdown
            className="InstitutionDropdown"
            label={toggleLabel}
            onClear={hasSelection ? onClearAll : undefined}
        >
            <ul className="InstitutionDropdown-list">
                {institutions.map((inst) => (
                    <li key={inst.id} className="InstitutionDropdown-item">
                        <label className="InstitutionDropdown-label">
                            <input
                                type="checkbox"
                                checked={values.includes(inst.id)}
                                onChange={() => onChange(inst.id)}
                            />
                            <span>{inst.name}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </Dropdown>
    );
}

InstitutionDropdown.propTypes = {
    institutions: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.number, name: PropTypes.string })
    ).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    onClearAll: PropTypes.func.isRequired,
};

export default InstitutionDropdown;
