import classNames from 'classnames';
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

export default function Breadcrumbs({ logoSrc }) {
    const { project } = useProject();
    const { locale } = useI18n();
    const crumbs = useBreadcrumbs();
    const instanceSettings = useSelector(
        (state) => state.data?.instance_settings
    );

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
                        title={project.name[locale]}
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
