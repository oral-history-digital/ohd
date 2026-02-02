import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function ProjectLogo({ logos, defaultLocale, className }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    // Return early if no logos are provided
    if (!logos || Object.keys(logos).length === 0) return null;

    const logoArray = Object.values(logos).filter((logo) => logo?.src);

    if (logoArray.length === 0) return null; // All logos lack src

    const logoForLocale = logoArray.find((logo) => logo.locale === locale);
    const logoForDefaultLocale = logoArray.find(
        (logo) => logo.locale === defaultLocale
    );

    const src = logoForLocale?.src || logoForDefaultLocale?.src;

    if (!src) return null; // No suitable logo found

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
