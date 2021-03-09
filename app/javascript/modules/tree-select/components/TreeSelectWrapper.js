import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import TreeSelect from './TreeSelect';

export default class TreeSelectWrapper extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.dataAvailable !== this.props.dataAvailable ||
            !isEqual(nextProps.tree, this.props.tree)
        );
    }

    render() {
        return (<TreeSelect {...this.props} />);
    }
}

TreeSelectWrapper.propTypes = {
    dataAvailable: PropTypes.bool.isRequired,
    tree: PropTypes.object,
};
