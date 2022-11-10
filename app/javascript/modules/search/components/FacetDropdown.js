import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

export default function FacetDropdown({
    label,
    children
}) {
    const { locale } = useI18n();

    const [open, setOpen] = useState(false);

    function handleClick(event) {
        event.preventDefault();
        setOpen(prev => !prev);
    }

    return (
        <div className="subfacet-container">
            <button
                className={classNames('Button', 'accordion', { 'active': open })}
                type="button"
                onClick={handleClick}
            >
                {label}
                {open ?
                    <FaMinus className="Icon Icon--primary" /> :
                    <FaPlus className="Icon Icon--primary" />
                }
            </button>

            <div className={classNames('panel', { 'open': open })}>
                {children}
            </div>
        </div>
    );
}

FacetDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
