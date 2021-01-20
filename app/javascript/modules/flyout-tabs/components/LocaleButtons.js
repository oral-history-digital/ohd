import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './LocaleButtons.module.scss';

import { pathBase } from 'lib/utils';

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
        const { projectId, projects, setLocale, history, location } = this.props;

        const locale = e.target.textContent;

        let newPath = location.pathname.replace(/^\/[a-z]{2,4}\/[a-z]{2}\//, pathBase({projectId, locale, projects}) + '/');

        history.push(newPath);
        setLocale(locale);
    }

    render() {
        const { currentLocale, locales } = this.props;

        return (
            <div className={styles.div}>
                {
                    locales.map((locale, index) => (
                        <button
                            key={locale}
                            type="button"
                            className={styles.button}
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
