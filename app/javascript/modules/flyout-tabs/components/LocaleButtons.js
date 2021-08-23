import { Component } from 'react';
import PropTypes from 'prop-types';

import { pathBase } from 'modules/routes';

class LocaleButtons extends Component {
    static propTypes = {
        currentLocale: PropTypes.string.isRequired,
        locales: PropTypes.array.isRequired,
        projectId: PropTypes.string,
        setLocale: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(e) {
        const { projectId, projects, setLocale, history, location } = this.props;

        const locale = e.target.textContent;

        let newPath;
        if (/^\/[a-z]{2}\/{0,1}$/.test(location.pathname)) {
            newPath = `/${locale}/`;
        } else {
            newPath = location.pathname.replace(/^(\/[a-z]{2,4}){0,1}\/([a-z]{2})\//, pathBase({projectId, locale, projects}) + '/');
        }

        history.push(newPath);
        setLocale(locale);
    }

    render() {
        const { currentLocale, locales } = this.props;

        return (
            <div className="LocaleButtons">
                {
                    locales.map(locale => (
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
