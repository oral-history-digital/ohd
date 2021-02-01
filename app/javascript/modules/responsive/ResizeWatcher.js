import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeAware from 'react-resize-aware';

import { SCREEN_WIDTH_BELOW_M, SCREEN_WIDTH_ABOVE_XL, currentScreenWidth }
    from './media-queries';

export default class ResizeWatcher extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = { screenWidth: null };
    }

    handleResize() {
        const oldWidth = this.state.screenWidth;
        const newWidth = currentScreenWidth();

        if (oldWidth === newWidth) {
            return;
        }

        if (newWidth === SCREEN_WIDTH_ABOVE_XL) {
            this.props.showFlyoutTabs();
        }
        if (newWidth === SCREEN_WIDTH_BELOW_M) {
            this.props.hideFlyoutTabs();
        }

        this.setState({ screenWidth: newWidth });
    }

    render() {
        return (
            <ResizeAware onResize={this.handleResize}>
                {this.props.children}
            </ResizeAware>
        )
    }
}

ResizeWatcher.propTypes = {
    children: PropTypes.node.isRequired,
    hideFlyoutTabs: PropTypes.func.isRequired,
    showFlyoutTabs: PropTypes.func.isRequired,
};
