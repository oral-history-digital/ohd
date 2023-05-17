import { useMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { OHD_DOMAINS } from 'modules/constants';
import { getProjects } from 'modules/data';
import isLocaleValid from './isLocaleValid';

export default function useProject() {
    const projects = useSelector(getProjects);
    const projectArray = Object.values(projects);
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');

    const isOHDPath = window.location.origin === OHD_DOMAINS[process.env.RAILS_ENV];

    if (isOHDPath) {
        if (matchWithProject && isLocaleValid(matchWithProject.params.locale)) {
            // Archive is running on OHD domain.
            return projectArray.find(
                project => project.shortname === matchWithProject.params.projectId
            );
        }
        if (matchWOProject && isLocaleValid(matchWOProject.params.locale)) {
            // No archive selected, i.e. this is a OHD path.
            // Return null or the OHD project. Null for now.
            return null;
        }
    } else {
        // Archive is running on its own domain.
        return projectArray.find(
            project => project.archive_domain === window.location.origin
        );
    }
}
