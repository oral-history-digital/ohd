import classNames from 'classnames';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

import { useDropdown } from '../hooks';

export function Dropdown({ label, onClear, children, className, align }) {
    const { open, toggle, containerRef, toggleRef, panelStyle } = useDropdown({
        align,
    });

    return (
        <div className={classNames('Dropdown', className)} ref={containerRef}>
            <button
                ref={toggleRef}
                type="button"
                className="Dropdown-toggle"
                onClick={() => toggle()}
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <span className="Dropdown-toggleLabel">{label}</span>
                <span className="Dropdown-toggleIcons">
                    {onClear && (
                        <span
                            className="Dropdown-clear"
                            role="button"
                            tabIndex={0}
                            aria-label="Clear"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    onClear();
                                }
                            }}
                        >
                            <FaTimes />
                        </span>
                    )}
                    <FaChevronDown
                        className={classNames('Dropdown-chevron', {
                            'Dropdown-chevron--open': open,
                        })}
                    />
                </span>
            </button>

            {open &&
                createPortal(
                    <div
                        className={classNames(
                            'Dropdown-panel',
                            className && `${className}-panel`
                        )}
                        style={panelStyle}
                        role="listbox"
                    >
                        {children}
                    </div>,
                    document.body
                )}
        </div>
    );
}

Dropdown.propTypes = {
    label: PropTypes.node.isRequired,
    onClear: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    align: PropTypes.oneOf(['left', 'right']),
};

export default Dropdown;
