import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';

export default class ErrorBoundaryComponent extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        const { locale, translations } = this.props;
        const { error } = this.state;

        if (error) {
            return (
                <div className="wrapper-content">
                    <h1>{ t({ locale, translations }, 'error') }</h1>
                    <p>{error.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundaryComponent.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
