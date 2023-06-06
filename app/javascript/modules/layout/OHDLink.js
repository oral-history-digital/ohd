import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { getCurrentUser, getCurrentProject, getProjects } from 'modules/data';
import { getLocale, setProjectId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';

function OHDLink({ className }) {
    const locale = useSelector(getLocale);
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const dispatch = useDispatch();
    const currentAccount = useSelector(getCurrentUser);

    const accessTokenParam = currentAccount?.access_token ? `access_token=${currentAccount.access_token}` : null;

    const unsetProjectId = useCallback(
        () => dispatch(setProjectId(null)),
        [dispatch]
    )

    return (
        project.display_ohd_link ?
            (project.archive_domain ?
                <a
                    title='OHD'
                    href={`${OHD_DOMAINS[railsMode]}/${locale}` + (!!accessTokenParam ? `?${accessTokenParam}` : '')}
                    className={classNames(className, 'u-mr')}
                >
                    <img className="SiteHeader-logo" src='/ohd-logo-gr.png' alt="" />
                </a> :
                <Link
                    to={`/${locale}`}
                    title='OHD'
                    onClick={unsetProjectId}
                    className={classNames(className, 'u-mr')}
                >
                    <img className="SiteHeader-logo" src='/ohd-logo-gr.png' alt="" />
                </Link>
            ) :
            null
    );
}

export default OHDLink;
