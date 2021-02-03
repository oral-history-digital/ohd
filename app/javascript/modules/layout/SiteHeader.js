import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProject } from 'modules/data';
import { getLocale } from 'modules/archive';
import { useI18n } from 'modules/i18n';

function SiteHeader() {
    const locale = useSelector(getLocale);
    const project = useSelector(getCurrentProject);
    const logos = project.logos;
    const { t } = useI18n();

    let src = null;
    if (logos) {
        Object.keys(logos).map(k => {
            if (logos[k].locale === locale) {
                src = logos[k].src
            }
        })
        src = src || (logos[0]?.src);
    }

    return (
        <header className="SiteHeader">
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

export default SiteHeader;
