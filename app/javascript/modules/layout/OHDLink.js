import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProject, getProjects } from 'modules/data';
import { getLocale } from 'modules/archive';
import { projectByDomain } from 'modules/routes';
import { OHD_DOMAIN } from './constants';

function OHDLink() {
    const locale = useSelector(getLocale);
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const projectHasOwnDomain = projectByDomain(projects);

    return (
        !project || project.display_ohd_link ?
            (projectHasOwnDomain ?
                <a title='OHD' href={`${OHD_DOMAIN[developmentMode ? 'development' : 'production']}/${locale}`}>OHD</a> :
                <Link
                    to={`/${locale}`}
                    title='OHD'
                >
                    OHD
                </Link>
            ) :
            null
    );
}

export default OHDLink;
