import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './LocaleButtons.module.scss';

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

        // with projectId
        let newPath = location.pathname.replace(/^\/[a-z]{2,4}\/[a-z]{2}\//, `/${projectId}/${newLocale}/`);
        // workaround: (without projectId in path), TODO: fit this when multi-project is finished
        if (newPath === location.pathname) {
            newPath = location.pathname.replace(/^\/[a-z]{2}\//, `/${newLocale}/`);
        }

        history.push(newPath);
        setLocale(newLocale);
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
