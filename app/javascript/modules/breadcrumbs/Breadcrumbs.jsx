import classNames from 'classnames';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';

import { BreadcrumbItem, Logo } from './components';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';

export default function Breadcrumbs({ logoSrc }) {
    const { project } = useProject();
    const crumbs = useBreadcrumbs();

    const shouldHideBreadcrumbs =
        crumbs.length === 0 ||
        (!project?.is_ohd && project?.display_ohd_link === false);

    if (shouldHideBreadcrumbs) {
        return null;
    }

    const logoVariant = project?.is_ohd ? 'default' : 'outline';

    return (
        <nav aria-label="breadcrumb" className={classNames('Breadcrumbs')}>
            <ol className="Breadcrumbs-list">
                <li className="Breadcrumbs-item">
                    <Logo logoSrc={logoSrc} variant={logoVariant} />
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
