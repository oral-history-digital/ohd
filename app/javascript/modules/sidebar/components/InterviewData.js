import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function InterviewData({
    title,
    open = false,
    url,
    isLoggedIn,
    locale,
    children,
}) {
    const history = useHistory();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(!isLoggedIn || open);

    function handleClick() {
        if (url && location.pathname !== url) {
            setIsOpen(true);
            history.push(url);
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
                lang={locale}
                onClick={handleClick}
            >
                {title}
                {buttonIcon}
            </button>
            {
                children && (
                    <div className={classNames('panel', { 'open': isOpen })}>
                        {children}
                    </div>
                )
            }
        </div>
    );
}

InterviewData.propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool,
    url: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
