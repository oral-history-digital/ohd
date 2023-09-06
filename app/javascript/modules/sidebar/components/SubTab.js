import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ErrorBoundary } from 'modules/react-toolbox';

export default function SubTab({
    title,
    url,
    children,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(matchPath(url, location.pathname));

    function handleClick() {
        if (url && location.pathname !== url) {
            setIsOpen(true);
            navigate(url);
        } else {
            setIsOpen(prev => !prev);
        }
    }

    let buttonIcon;
    if (typeof children !== 'undefined') {
        buttonIcon = isOpen ?
            <FaMinus className="Icon Icon--primary" /> :
            <FaPlus className="Icon Icon--primary" />;
    }

    return (
        <div>
            <button
                type="button"
                className={classNames('Button', 'accordion', {
                    'active': isOpen,
                    'only-link': typeof children === 'undefined',
                })}
                onClick={handleClick}
            >
                {title}
                {buttonIcon}
            </button>
            {
                children && (
                    <div className={classNames('panel', { 'open': isOpen })}>
                        <ErrorBoundary small>
                            {isOpen && children}
                        </ErrorBoundary>
                    </div>
                )
            }
        </div>
    );
}

SubTab.propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool,
    url: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
