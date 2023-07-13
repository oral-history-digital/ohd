import { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import TreeSelectComponent from './TreeSelectComponent';

export default class TreeSelectComponentWrapper extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.isLoading !== this.props.isLoading ||
            !isEqual(nextProps.tree, this.props.tree)
        );
    }

    render() {
        return (<TreeSelectComponent {...this.props} />);
    }
};

TreeSelectComponentWrapper.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    tree: PropTypes.object,
};
