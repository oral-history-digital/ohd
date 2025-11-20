import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        const { small } = this.props;
        const { error } = this.state;

        if (error) {
            const message = `Error: ${error.message}`;

            return (
                <div className="wrapper-content">
                    {small ? <p>{message}</p> : <h1>{message}</h1>}
                    <p></p>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    small: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
