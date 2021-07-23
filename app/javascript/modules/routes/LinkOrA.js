import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { OHD_DOMAIN_PRODUCTION, OHD_DOMAIN_DEVELOPMENT } from 'modules/layout';
import { getLocale, setProjectId, getProjectId } from 'modules/archive';
import { getCurrentProject } from 'modules/data';

function LinkOrA({
    to,
    className,
    project,
    children,
    onLinkClick,
    params,
}) {
    const locale = useSelector(getLocale);
    const currentProjectId = useSelector(getProjectId);
    const dispatch = useDispatch();

    const onOHD = [OHD_DOMAIN_PRODUCTION, OHD_DOMAIN_DEVELOPMENT].indexOf(window.location.origin) > -1;
    const projectHasOtherDomain = project.archive_domain && project.archive_domain !== window.location.origin;
    const projectIsCurrentProject = project.identifier === currentProjectId;

    const ohdDomain = developmentMode ? OHD_DOMAIN_DEVELOPMENT : OHD_DOMAIN_PRODUCTION;

    const path = project.archive_domain ? `/${locale}/${to}` : `/${project.identifier}/${locale}/${to}`;
    const domain = project.archive_domain || ohdDomain;

    return (
        (onOHD && !projectHasOtherDomain) || projectIsCurrentProject ?
            <Link
                className={className}
                to={path}
                onClick={() => dispatch( setProjectId(project.identifier), onLinkClick() )}
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
