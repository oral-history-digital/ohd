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
              <div className={classNames('registry-entry-edit-buttons', {
                    'invisible': !this.state.isOpen})}>
                    <i
                      className='fa-times fa'
                      style={{'position': 'absolute', 'color': '#8b8b7a', 'cursor': 'pointer'}}
                      onClick={this.toggle}
                    />
                  <ul>
                      {children}
                  </ul>
              </div>
          </Fragment>
      );
    }
}

function PopupMenuItem({ children }) {
    return (
        <li>{children}</li>
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
