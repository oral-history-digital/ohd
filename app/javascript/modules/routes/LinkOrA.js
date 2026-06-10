/* global railsMode */
import { getLocale, getProjectId, setProjectId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import { getCurrentUser } from 'modules/data';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function LinkOrA({
    to = '',
    className,
    style,
    project,
    children,
    onLinkClick = (f) => f,
    params,
}) {
    const locale = useSelector(getLocale);
    const currentProjectId = useSelector(getProjectId);
    const currentAccount = useSelector(getCurrentUser);
    const dispatch = useDispatch();

    // If the project doesn't exist in the store, render children without a link to prevent crashes
    // As soon as the project data is available, this component will re-render with the correct link
    if (!project) {
        return (
            <span className={className} style={style}>
                {children}
            </span>
        );
    }

    const onOHD = OHD_DOMAINS[railsMode] === window.location.origin;
    const projectHasOtherDomain =
        project.archive_domain &&
        project.archive_domain !== window.location.origin;
    const projectIsCurrentProject = project.shortname === currentProjectId;

    const ohdDomain = OHD_DOMAINS[railsMode];

    const pathBase = project.archive_domain
        ? `/${locale}`
        : `/${project.shortname}/${locale}`;
    const path = to.length > 0 ? `${pathBase}/${to}` : pathBase;
    const domain = project.archive_domain || ohdDomain;

    const accessTokenParam =
        projectIsCurrentProject ||
        (onOHD && !projectHasOtherDomain) ||
        !currentAccount
            ? null
            : `access_token=${currentAccount.access_token}`;
    const paramsWithAccessToken = [params, accessTokenParam]
        .filter(Boolean)
        .join('&');
    const joiner = path.includes('?') ? '&' : '?';
    const pathWithParams = paramsWithAccessToken
        ? `${path}${joiner}${paramsWithAccessToken}`
        : path;

    return (onOHD && !projectHasOtherDomain) || projectIsCurrentProject ? (
        <Link
            className={className}
            style={style}
            to={pathWithParams}
            onClick={() =>
                dispatch(setProjectId(project.shortname), onLinkClick(pathBase))
            }
        >
            {children}
        </Link>
    ) : (
        <a
            className={className}
            style={style}
            href={`${domain}${pathWithParams}`}
        >
            {children}
        </a>
    );
}

export default LinkOrA;

LinkOrA.propTypes = {
    to: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    project: PropTypes.shape({
        shortname: PropTypes.string.isRequired,
        archive_domain: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
    onLinkClick: PropTypes.func,
    params: PropTypes.string,
};
