import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function ProjectLogo({ logos, defaultLocale, className }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    let src = null;
    if (logos) {
        const logoArray = Object.values(logos);

        const logoForLocale = logoArray.find((logo) => logo.locale === locale);
        const logoForDefaultLocale = logoArray.find(
            (logo) => logo.locale === defaultLocale
        );

        src = logoForLocale?.src || logoForDefaultLocale?.src || null;
    }

    return (
        <Link
            to={pathBase}
            className={classNames('Link', className)}
            title={t('home')}
        >
            <img className="SiteHeader-logo" src={src} alt="Collection logo" />
        </Link>
    );
}

ProjectLogo.propTypes = {
    logos: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired,
    className: PropTypes.string,
};
