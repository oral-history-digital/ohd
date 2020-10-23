import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { t } from '../../../lib/utils';

class PopupMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false };
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    close() {
        this.setState({ isOpen: false });
    }

    toggle() {
        this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
    }

    render() {
        let { className, children } = this.props;

        return (
            <Fragment>
                <div
                    className="flyout-sub-tabs-content-ico-link"
                    title={t(this.props, 'more')}
                    onClick={this.toggle}
                >
                    <i className="fa fa-ellipsis-v" />
                </div>
                <div className={classNames('popup-menu', {
                    'popup-menu--invisible': !this.state.isOpen})}>
                    <i
                        className='popup-menu__close fa-times fa'
                        onClick={this.toggle}
                    />
                    <ul className="popup-menu__list">
                        {children}
                    </ul>
                </div>
            </Fragment>
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
