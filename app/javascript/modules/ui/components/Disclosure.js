import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Disclosure({
    initialIsOpen = false,
    className,
    titleClassName,
    contentClassName,
    title,
    children,
}) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    return (
        <div className={classNames('Disclosure', className)}>
            <button
                type="button"
                className="Disclosure-toggle"
                onClick={() => setIsOpen(prevState => !prevState)}
            >
                {isOpen ?
                    <FaMinus className="Disclosure-icon" /> :
                    <FaPlus className="Disclosure-icon" />
                }
                <p className={classNames('Disclosure-title', titleClassName)}>
                    {title}
                </p>
            </button>
            <div className={classNames('Disclosure-content', contentClassName, { 'is-expanded': isOpen })}>
                {children}
            </div>
        </div>
    );
}

Disclosure.propTypes = {
    initialIsOpen: PropTypes.bool,
    className: PropTypes.string,
    titleClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
