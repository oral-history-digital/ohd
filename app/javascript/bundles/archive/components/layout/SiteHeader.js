import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { t } from '../../../../lib/utils';

function SiteHeader(props) {
    const { logos, locale } = props;

    let src = null;
    if (logos) {
        Object.keys(logos).map((k,i) => {
            if (logos[k].locale === locale) {
                src = logos[k].src
            }
        })
        src = src || (logos[0] && logos[0].src);
    }

    return (
        <header className='site-header'>
            <Link to={`/${locale}`} className="logo-link" title={t(props, 'home')}>
                <img className="logo-img" src={src}/>
            </Link>
        </header>
    );
}

SiteHeader.propTypes = {
    logos: PropTypes.object,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};

export default SiteHeader;
