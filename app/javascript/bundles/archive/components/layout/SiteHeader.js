import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { useI18n } from '../../hooks/i18n';

function SiteHeader({
    logos,
    transcriptScrollEnabled,
    locale,
}) {
    const { t } = useI18n();

    let src = null;
    if (logos) {
        Object.keys(logos).map(k => {
            if (logos[k].locale === locale) {
                src = logos[k].src
            }
        })
        src = src || (logos[0] && logos[0].src);
    }

    return (
        <header className={classNames('SiteHeader', { 'is-hidden': transcriptScrollEnabled })}>
            <Link
                to={`/${locale}`}
                className="logo-link"
                title={t('home')}
            >
                <img className="logo-img" src={src}/>
            </Link>
        </header>
    );
}

SiteHeader.propTypes = {
    logos: PropTypes.object,
    transcriptScrollEnabled: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
};

export default SiteHeader;
