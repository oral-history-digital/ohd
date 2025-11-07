import { useSelector, useDispatch } from 'react-redux';

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
    const projectIsCurrentProject = project.shortname === currentProjectId;

    const ohdDomain = OHD_DOMAINS[railsMode];

    const pathBase = project.archive_domain ? `/${locale}` : `/${project.shortname}/${locale}`;
    const path = to.length > 0 ? `${pathBase}/${to}` : pathBase;
    const domain = project.archive_domain || ohdDomain;

    const accessTokenParam = projectIsCurrentProject || (onOHD && !projectHasOtherDomain) || !currentAccount ?
        null :
        `access_token=${currentAccount.access_token}`;
    const paramsWithAccessToken = [params, accessTokenParam].filter(Boolean).join('&');
    const joiner = path.includes('?') ? '&' : '?';
    const pathWithParams = paramsWithAccessToken ? `${path}${joiner}${paramsWithAccessToken}` : path;

    return (
        <a
            className={className}
            style={style}
            href={`${domain}${pathWithParams}`}
        >
            { children }
        </a>
    );
}

export default LinkOrA;
