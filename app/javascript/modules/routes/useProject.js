import { getProjects } from 'modules/data';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import isLocaleValid from './isLocaleValid';

export default function useProject() {
    const projects = useSelector(getProjects);
    const projectArray = Object.values(projects || {});
    const matchWithProject = useMatch('/:projectId/:locale/*');

    let currentProject;
    if (matchWithProject && isLocaleValid(matchWithProject.params.locale)) {
        // Archive is running on OHD domain.
        currentProject = projectArray.find(
            (project) => project.shortname === matchWithProject.params.projectId
        );
    } else {
        // Archive is running on its own domain.
        currentProject = projectArray.find(
            (project) => project.archive_domain === window.location.origin
        );
    }

    return {
        project: currentProject,
        // `projectShortname` is the backend "shortname" identifier used in URLs.
        projectShortname: currentProject?.shortname,
        // Keep `projectId` as a backward-compatible alias for now (maps to shortname).
        // TODO: Refactor code to use `projectShortname` and remove `projectId` to avoid confusion with numeric database ID.
        projectId: currentProject?.shortname,
        // Numeric database id when available — useful for API calls that require the real id.
        projectDbId: currentProject?.id,
        isOhd: currentProject?.is_ohd,
    };
}
