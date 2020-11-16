import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { t } from '../../../lib/utils';

function PopupMenu(props) {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return isOpen ?
        (<OutsideClickHandler onOutsideClick={close} display="inline-block">
            <div
                className="flyout-sub-tabs-content-ico-link"
                title={t(props, 'more')}
                onClick={close}
            >
                <i className="fa fa-ellipsis-v" />
            </div>
            <div className={classNames('popup-menu', {
                'popup-menu--invisible': !isOpen})}>
                <i
                    className="popup-menu__close fa-times fa"
                    onClick={close}
                />
                <ul className="popup-menu__list">
                    {props.children}
                </ul>
            </div>
        </OutsideClickHandler>) : (
            <div
                className="flyout-sub-tabs-content-ico-link"
                title={t(props, 'more')}
                onClick={open}
            >
                <i className="fa fa-ellipsis-v" />
            </div>
        );
}

function PopupMenuItem({ children }) {
    return (
        <li className="popup-menu__item">
            {children}
        </li>
    );
}

PopupMenu.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    translations: PropTypes.any,
    locale: PropTypes.any
};

PopupMenuItem.propTypes = {
    children: PropTypes.element.isRequired
};

PopupMenu.Item = PopupMenuItem;

export default PopupMenu;
