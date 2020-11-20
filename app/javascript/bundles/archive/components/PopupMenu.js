import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { t } from 'lib/utils';

function PopupMenu(props) {
    const trigger = (
        <button
            className="popup-menu__trigger"
            title={t(props, 'more')}
        >
            <i className="fa fa-ellipsis-v popup-menu__trigger-icon" />
        </button>
    );

    return (
        <Popup
            className={classNames('popup-menu', props.className)}
            trigger={trigger}
            on={['click']}
            contentStyle={{ zIndex:1001 }}
            position={['right top', 'center top', 'left top']}
        >
            <ul className="popup-menu__list">
                {props.children}
            </ul>
        </Popup>
    );
}

const PopupMenuItem = ({ children }) => (
    <li className="popup-menu__item">
        {children}
    </li>
);

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
