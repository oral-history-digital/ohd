import React, { Component } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { t } from '../../../lib/utils';

class PopupMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({ isOpen: true });
    }

    close() {
        this.setState({ isOpen: false });
    }

    render() {
        const { children } = this.props;
        const { isOpen } = this.state;

        return isOpen ?
            (<OutsideClickHandler onOutsideClick={this.close}>
                <div
                    className="flyout-sub-tabs-content-ico-link"
                    title={t(this.props, 'more')}
                    onClick={this.close}
                >
                    <i className="fa fa-ellipsis-v" />
                </div>
                <div className={classNames('popup-menu', {
                    'popup-menu--invisible': !isOpen})}>
                    <i
                        className='popup-menu__close fa-times fa'
                        onClick={this.close}
                    />
                    <ul className="popup-menu__list">
                        {children}
                    </ul>
                </div>
            </OutsideClickHandler>) : (
                <div
                    className="flyout-sub-tabs-content-ico-link"
                    title={t(this.props, 'more')}
                    onClick={this.open}
                >
                    <i className="fa fa-ellipsis-v" />
                </div>
            );
    }
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
