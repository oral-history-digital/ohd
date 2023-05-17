import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { OHD_DOMAINS } from 'modules/constants';
import { getLocale, setProjectId, getProjectId } from 'modules/archive';
import { getCurrentUser } from 'modules/data';

function LinkOrA({
    to = '',
    className,
    style,
    project,
    children,
    onLinkClick = f => f,
    params,
}) {
    const locale = useSelector(getLocale);
    const currentProjectId = useSelector(getProjectId);
    const currentAccount = useSelector(getCurrentUser);
    const dispatch = useDispatch();

    const onOHD = OHD_DOMAINS[railsMode] === window.location.origin;
    const projectHasOtherDomain = project.archive_domain && project.archive_domain !== window.location.origin;
    const projectIsCurrentProject = project.identifier === currentProjectId;

    const ohdDomain = OHD_DOMAINS[railsMode];

    const pathBase = project.archive_domain ? `/${locale}` : `/${project.identifier}/${locale}`;
    const path = to.length > 0 ? `${pathBase}/${to}` : pathBase;
    const domain = project.archive_domain || ohdDomain;

    const accessTokenParam = currentAccount?.access_token ? `access_token=${currentAccount.access_token}` : null;
    const paramsWithAccessToken = [params, accessTokenParam].filter(Boolean).join('&');

    return (
        (onOHD && !projectHasOtherDomain) || projectIsCurrentProject ?
            <Link
                className={className}
                style={style}
                to={path}
                onClick={() => dispatch( setProjectId(project.identifier), onLinkClick(pathBase) )}
            >
                { children }
            </Link> :
            <a
                className={className}
                style={style}
                href={`${domain}${path}${paramsWithAccessToken.length > 0 ? '?' + paramsWithAccessToken : ''}`}
            >
                { children }
            </a>
    );
}

export default LinkOrA;
