import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { OHD_DOMAINS } from 'modules/layout';
import { getLocale, setProjectId, getProjectId } from 'modules/archive';
import { getCurrentProject } from 'modules/data';

function LinkOrA({
    to = '',
    className,
    project,
    children,
    onLinkClick,
    params,
}) {
    const locale = useSelector(getLocale);
    const currentProjectId = useSelector(getProjectId);
    const dispatch = useDispatch();

    const onOHD = OHD_DOMAINS[railsMode] === window.location.origin;
    const projectHasOtherDomain = project.archive_domain && project.archive_domain !== window.location.origin;
    const projectIsCurrentProject = project.identifier === currentProjectId;

    const ohdDomain = OHD_DOMAINS[railsMode];

    const pathBase = project.archive_domain ? `/${locale}` : `/${project.identifier}/${locale}`;
    const path = to.length > 0 ? `${pathBase}/${to}` : pathBase;
    const domain = project.archive_domain || ohdDomain;

    return (
        (onOHD && !projectHasOtherDomain) || projectIsCurrentProject ?
            <Link
                className={className}
                to={path}
                onClick={() => dispatch( setProjectId(project.identifier), onLinkClick(pathBase) )}
            >
                { children }
            </Link> :
            <a
                className={className}
                href={`${domain}${path}${params ? '?' + params : ''}`}
            >
                { children }
            </a>
    );
}

export default LinkOrA;
