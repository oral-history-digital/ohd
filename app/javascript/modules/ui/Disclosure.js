import { useState } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

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
                onClick={() => setIsOpen((prevState) => !prevState)}
            >
                {isOpen ? (
                    <FaMinus className="Disclosure-icon" />
                ) : (
                    <FaPlus className="Disclosure-icon" />
                )}
                <div className={classNames('Disclosure-title', titleClassName)}>
                    {title}
                </div>
            </button>
            <div
                className={classNames('Disclosure-content', contentClassName, {
                    'is-expanded': isOpen,
                })}
            >
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
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
