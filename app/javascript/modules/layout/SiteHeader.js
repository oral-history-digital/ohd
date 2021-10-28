import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OHDLink from './OHDLink';

import { getCurrentProject } from 'modules/data';
import { getLocale } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

function SiteHeader() {
    const locale = useSelector(getLocale);
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);
    const logos = project?.logos;
    const { t } = useI18n();
    const defaultLocale = project?.default_locale;

    let src = null;
    if (logos) {
        const logoArray = Object.values(logos);

        const logoForLocale = logoArray.find(logo => logo.locale === locale);
        const logoForDefaultLocale = logoArray.find(logo => logo.locale === defaultLocale);

        src = logoForLocale?.src || logoForDefaultLocale?.src || null;
    }

    return (
        <header className="SiteHeader">
            <OHDLink />
            <Link
                to={pathBase}
                className="logo-link"
                title={t('home')}
            >
                <img
                    className="logo-img"
                    src={src}
                    alt="Collection logo"
                />
            </Link>
        </header>
    );
}

export default SiteHeader;
