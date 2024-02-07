import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

export default function FacetDropdown({
    label,
    facet,
    admin = false,
    children
}) {
    const { locale } = useI18n();

    const searchParams = new URLSearchParams(document.location.search);
    const [open, setOpen] = useState(searchParams.has(`${facet}[]`));

    function handleClick(event) {
        event.preventDefault();
        setOpen(prev => !prev);
    }

    return (
        <div className={classNames('Facet', {
            'Facet--admin': admin,
            'is-open': open
        })}>
            <button
                className={classNames('Button', 'Facet-button')}
                type="button"
                onClick={handleClick}
            >
                <span className="Facet-label">
                    {label}
                </span>
                {open ?
                    <FaMinus className="Facet-icon Icon Icon--primary" /> :
                    <FaPlus className="Facet-icon Icon Icon--primary" />
                }
            </button>

            <div className="Facet-panel">
                {open && children}
            </div>
        </div>
    );
}

FacetDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    admin: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
