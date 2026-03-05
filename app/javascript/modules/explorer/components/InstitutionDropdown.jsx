import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

export function InstitutionDropdown({
    institutions,
    values,
    onChange,
    onClearAll,
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const hasSelection = values.length > 0;

    const toggleItem = (id) => onChange(id);

    const handleClear = (e) => {
        e.stopPropagation();
        onClearAll();
    };

    useEffect(() => {
        if (!open) return;
        const handleOutsideClick = (e) => {
            if (!containerRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [open]);

    const toggleLabel = hasSelection
        ? values.length === 1
            ? institutions.find((i) => i.id === values[0])?.name
            : `${values.length} institutions`
        : 'All institutions';

    return (
        <div className="InstitutionDropdown" ref={containerRef}>
            <button
                type="button"
                className="InstitutionDropdown-toggle"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="InstitutionDropdown-toggleLabel">
                    {toggleLabel}
                </span>
                <span className="InstitutionDropdown-toggleIcons">
                    {hasSelection && (
                        <span
                            className="InstitutionDropdown-clear"
                            role="button"
                            tabIndex={0}
                            aria-label="Clear institution filter"
                            onClick={handleClear}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleClear(e)
                            }
                        >
                            <FaTimes />
                        </span>
                    )}
                    <FaChevronDown
                        className={
                            open
                                ? 'InstitutionDropdown-chevron InstitutionDropdown-chevron--open'
                                : 'InstitutionDropdown-chevron'
                        }
                    />
                </span>
            </button>

            {open && (
                <ul className="InstitutionDropdown-list" role="listbox">
                    {institutions.map((inst) => (
                        <li key={inst.id} className="InstitutionDropdown-item">
                            <label className="InstitutionDropdown-label">
                                <input
                                    type="checkbox"
                                    checked={values.includes(inst.id)}
                                    onChange={() => toggleItem(inst.id)}
                                />
                                <span>{inst.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
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
