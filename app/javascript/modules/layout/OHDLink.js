import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { getCurrentProject, getProjects } from 'modules/data';
import { getLocale, setProjectId } from 'modules/archive';
import { projectByDomain } from 'modules/routes';
import { OHD_DOMAINS } from './constants';

function OHDLink({ className }) {
    const locale = useSelector(getLocale);
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const projectHasOwnDomain = projectByDomain(projects);
    const dispatch = useDispatch();

    const unsetProjectId = useCallback(
        () => dispatch(setProjectId(null)),
        [dispatch]
    )

    return (
        !project || project.display_ohd_link ?
            (projectHasOwnDomain ?
                <a
                    title='OHD'
                    href={`${OHD_DOMAINS[railsMode]}/${locale}`}
                    className={classNames(className, 'u-mr')}
                >
                    <img className="logo-img" src='/ohd-logo-gr.png' alt="" />
                </a> :
                <Link
                    to={`/${locale}`}
                    title='OHD'
                    onClick={unsetProjectId}
                    className={classNames(className, 'u-mr')}
                >
                    <img className="logo-img" src='/ohd-logo-gr.png' alt="" />
                </Link>
            ) :
            null
    );
}

export default OHDLink;
