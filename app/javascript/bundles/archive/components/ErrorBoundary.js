import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'lib/utils';

class ErrorBoundary extends Component {
    static propTypes = {
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        children: PropTypes.node,
    }

    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div className="wrapper-content">
                    <h1>{ t(this.props, 'error') }</h1>
                    <p>{this.state.error.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
