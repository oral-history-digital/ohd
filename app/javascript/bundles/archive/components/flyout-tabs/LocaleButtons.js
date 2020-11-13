import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class LocaleButtons extends Component {
    static propTypes = {
        currentLocale: PropTypes.string.isRequired,
        locales: PropTypes.array.isRequired,
        projectId: PropTypes.string.isRequired,
        setLocale: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props, context);

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(e) {
        const { projectId, setLocale } = this.props;

        const newLocale = e.target.textContent;

        // with projectId
        let newPath = this.context.router.route.location.pathname.replace(/^\/[a-z]{2,4}\/[a-z]{2}\//, `/${projectId}/${newLocale}/`);
        // workaround: (without projectId in path), TODO: fit this when multi-project is finished
        if (newPath === this.context.router.route.location.pathname) {
            newPath = this.context.router.route.location.pathname.replace(/^\/[a-z]{2}\//, `/${newLocale}/`);
        }
        this.context.router.history.push(newPath);

        setLocale(newLocale);
    }

    render() {
        const { currentLocale, locales } = this.props;

        return (
            <div className="LocaleButtons">
                {
                    locales.map((locale, index) => (
                        <button
                            key={locale}
                            type="button"
                            className="LocaleButtons-button"
                            disabled={locale === currentLocale}
                            onClick={this.handleButtonClick}
                        >
                            {locale}
                        </button>
                    ))
                }
            </div>
        );
    }
}

export default LocaleButtons;
