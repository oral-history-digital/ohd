import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Link } from 'react-router-dom';

export default function ProjectLogo() {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const { project } = useProject();

    if (!project) {
        return null;
    }

    const logos = project?.logos || {};
    const defaultLocale = project.default_locale;

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
        <div className="ProjectLogo">
            <Link
                to={pathBase}
                className={classNames('Link', 'ProjectLogo--link')}
                title={t('Home')}
            >
                <img
                    className="ProjectLogo--logo"
                    src={src}
                    alt="Project logo"
                />
            </Link>
        </div>
    );
}
