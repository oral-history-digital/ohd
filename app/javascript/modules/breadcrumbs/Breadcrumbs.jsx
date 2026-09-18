import classNames from 'classnames';
import { getUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { BreadcrumbItem, Logo } from './components';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';

export function selectBreadcrumbLogo({
    logoSrc,
    logoVariant,
    instanceSettings,
}) {
    if (logoSrc) return logoSrc;

    return logoVariant === 'outline'
        ? instanceSettings?.secondary_breadcrumb_logo_url ||
              instanceSettings?.breadcrumb_logo_url
        : instanceSettings?.breadcrumb_logo_url ||
              instanceSettings?.secondary_breadcrumb_logo_url;
}

export function getBreadcrumbLogoTitle(umbrellaProject, locale) {
    const name =
        umbrellaProject?.name?.[locale] ||
        umbrellaProject?.display_name?.[locale];
    const displayShortname = umbrellaProject?.display_shortname;

    if (!name) return undefined;

    return displayShortname ? `${name} (${displayShortname})` : name;
}

export default function Breadcrumbs({ logoSrc }) {
    const { project } = useProject();
    const { locale } = useI18n();
    const crumbs = useBreadcrumbs();
    const instanceSettings = useSelector(
        (state) => state.data?.instance_settings
    );
    const umbrellaProject = useSelector(getUmbrellaProject);

    const shouldHideBreadcrumbs =
        crumbs.length === 0 ||
        (!project?.is_umbrella && project?.display_ohd_link === false);

    if (shouldHideBreadcrumbs) return null;

    const logoVariant = project?.is_umbrella ? 'default' : 'outline';
    const breadcrumbLogoSrc = selectBreadcrumbLogo({
        logoSrc,
        logoVariant,
        instanceSettings,
    });

    return (
        <nav aria-label="breadcrumb" className={classNames('Breadcrumbs')}>
            <ol className="Breadcrumbs-list">
                <li className="Breadcrumbs-item">
                    <Logo
                        logoSrc={breadcrumbLogoSrc}
                        title={getBreadcrumbLogoTitle(umbrellaProject, locale)}
                        variant={logoVariant}
                    />
                </li>

                {crumbs.map((crumb, index) => {
                    return (
                        <BreadcrumbItem
                            key={index}
                            crumb={crumb}
                            isLast={index === crumbs.length - 1}
                            index={index}
                            totalCount={crumbs.length}
                        />
                    );
                })}
            </ol>
        </nav>
    );
}

Breadcrumbs.propTypes = {
    logoSrc: PropTypes.string,
};
