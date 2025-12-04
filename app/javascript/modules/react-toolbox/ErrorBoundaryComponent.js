import { Component } from 'react';

import { t } from 'modules/i18n';
import PropTypes from 'prop-types';

export default class ErrorBoundaryComponent extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        const { locale, translations, small } = this.props;
        const { error } = this.state;

        if (error) {
            const message = `${t({ locale, translations }, 'error')}: ${error.message}`;

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

ErrorBoundaryComponent.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    small: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
