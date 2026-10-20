import { getProjects } from 'modules/data';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import { findProjectByDomain } from './domainUtils';
import isLocaleValid from './isLocaleValid';

/**
 * Resolves route identifiers without requesting project details.
 * Dedicated domains, numeric IDs, and the umbrella flag use legacy project records during migration.
 *
 * @returns {{projectShortname: string|undefined, projectDbId: number|undefined, isUmbrella: boolean|undefined}}
 * Current project identity; the route shortname is available before its summary loads.
 */
export default function useProjectIdentity() {
    const projects = useSelector(getProjects);
    const match = useMatch('/:projectId/:locale/*');
    const routeShortname =
        match && isLocaleValid(match.params.locale)
            ? match.params.projectId
            : undefined;
    const project = routeShortname
        ? Object.values(projects || {}).find(
              (record) => record.shortname === routeShortname
          )
        : findProjectByDomain(projects);

    return {
        projectShortname: routeShortname || project?.shortname,
        projectDbId: project?.id,
        isUmbrella: project?.is_umbrella,
    };
}
