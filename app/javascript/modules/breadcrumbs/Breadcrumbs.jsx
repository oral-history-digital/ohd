import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { useCurrentPage, usePathBase } from 'modules/routes';
import ProjectLogo from 'modules/startpage/ProjectLogo';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Divider, Logo, SimulateLogo } from './components';
import { BREADCRUMB_MODES, useBreadcrumbMode } from './hooks/useBreadcrumbMode';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';
import { getArchiveLabel } from './utils';

export default function Breadcrumbs({ logoSrc }) {
    const crumbs = useBreadcrumbs();
    const { mode, archiveProject, archivePath } = useBreadcrumbMode();
    const currentPage = useCurrentPage();
    const { locale } = useI18n();
    const pathBase = usePathBase();
    const isArchiveStartpageLayout =
        mode === BREADCRUMB_MODES.ARCHIVE_LOGO &&
        currentPage.pageType === 'project_startpage';

    // archivePath is set explicitly for the OHD-catalog case; otherwise fall
    // back to the current route's base path (archive on own domain/route).
    const resolvedArchivePath = archivePath ?? pathBase;

    const renderLogo = () => {
        if (mode === BREADCRUMB_MODES.ARCHIVE_LOGO) {
            return (
                <Link to={resolvedArchivePath} className="Breadcrumbs-logoLink">
                    <ProjectLogo
                        project={archiveProject}
                        isLinkActive={false}
                    />
                </Link>
            );
        }

        if (mode === BREADCRUMB_MODES.ARCHIVE_NAME) {
            const name =
                getArchiveLabel(archiveProject, locale) ??
                archiveProject.shortname;
            return <SimulateLogo archiveName={name} to={resolvedArchivePath} />;
        }

        // Mode A — OHD logo (default behaviour).
        return <Logo logoSrc={logoSrc} />;
    };

    if (!crumbs) return null;

    return (
        <nav
            aria-label="breadcrumb"
            className={classNames('Breadcrumbs', {
                'Breadcrumbs--stacked': isArchiveStartpageLayout,
            })}
        >
            {isArchiveStartpageLayout ? (
                <>
                    <div className="Breadcrumbs-logoRow">{renderLogo()}</div>
                    <ol className="Breadcrumbs-list Breadcrumbs-list--subline">
                        {crumbs.map((crumb, index) => {
                            const isLast = index === crumbs.length - 1;
                            const shouldRenderAsCurrent =
                                !crumb.to || (isLast && !crumb.allowLastLink);

                            return (
                                <li key={index} className="Breadcrumbs-item">
                                    <span
                                        className="Breadcrumbs-dividerText"
                                        aria-hidden="true"
                                    >
                                        /
                                    </span>

                                    {shouldRenderAsCurrent ? (
                                        <span
                                            className="Breadcrumbs-current"
                                            aria-current={
                                                isLast ? 'page' : undefined
                                            }
                                        >
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        <Link
                                            to={crumb.to}
                                            className="Breadcrumbs-link"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </>
            ) : (
                <ol className="Breadcrumbs-list">
                    <li className="Breadcrumbs-item">{renderLogo()}</li>

                    {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1;
                        const shouldRenderAsCurrent =
                            !crumb.to || (isLast && !crumb.allowLastLink);

                        return (
                            <li key={index} className="Breadcrumbs-item">
                                <Divider />

                                {shouldRenderAsCurrent ? (
                                    <span
                                        className="Breadcrumbs-current"
                                        aria-current={
                                            isLast ? 'page' : undefined
                                        }
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        to={crumb.to}
                                        className="Breadcrumbs-link"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </nav>
    );
}

Breadcrumbs.propTypes = {
    logoSrc: PropTypes.string,
};
