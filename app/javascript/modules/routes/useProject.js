import { useMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getProjects } from 'modules/data';
import isLocaleValid from './isLocaleValid';

export default function useProject() {
    const projects = useSelector(getProjects);
    const projectArray = Object.values(projects);
    const matchWithProject = useMatch('/:projectId/:locale/*');

    let currentProject;
    if (matchWithProject && isLocaleValid(matchWithProject.params.locale)) {
        // Archive is running on OHD domain.
        currentProject = projectArray.find(
            project => project.identifier === matchWithProject.params.projectId
        );
    } else {
        // Archive is running on its own domain.
        currentProject = projectArray.find(
            project => project.archive_domain === window.location.origin
        );
    }

    return {
        project: currentProject,
        projectId: currentProject?.identifier,
        isOhd: currentProject?.is_ohd,
    };
}
