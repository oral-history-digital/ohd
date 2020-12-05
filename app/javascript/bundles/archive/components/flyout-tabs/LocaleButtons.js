import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LocaleButtons extends Component {
    static propTypes = {
        currentLocale: PropTypes.string.isRequired,
        locales: PropTypes.array.isRequired,
        projectId: PropTypes.string.isRequired,
        setLocale: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(e) {
        const { projectId, setLocale, history, location } = this.props;

        const newLocale = e.target.textContent;

        let newPath = location.pathname.replace(/^\/[a-z]{2,4}\/[a-z]{2}\//, `/${projectId}/${newLocale}/`);

        history.push(newPath);
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
