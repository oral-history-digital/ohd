import { getProjects, useProjectDetail } from 'modules/data';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import { findProjectByDomain } from './domainUtils';
import isLocaleValid from './isLocaleValid';

/**
 * @typedef {import('../data/hooks/useProjectDetail').ProjectDetailOptions} ProjectDetailOptions
 * @typedef {import('../data/hooks/useProjectDetail').ProjectDetailResult} ProjectDetailResult
 * @typedef {Object} ProjectIdentity
 * @property {Object|undefined} project - Current project, if available.
 * @property {string|undefined} projectShortname - Public identifier used in project URLs.
 * @property {string|undefined} projectId - Deprecated alias for projectShortname.
 * @property {number|undefined} projectDbId - Internal ID for relationships and mutations.
 * @property {boolean|undefined} isUmbrella - Whether this is the umbrella project.
 */

/**
 * Resolves the current project from its route or domain. During migration,
 * calls without options return the legacy Redux record. Passing options (including {})
 * loads API details through Redux, without falling back to the legacy record.
 *
 * @param {ProjectDetailOptions} [options] - Profile and includes; omit to retain the legacy read.
 * @returns {ProjectIdentity|(ProjectIdentity & ProjectDetailResult)} Project identity and, with options, request status and refresh.
 */
export default function useProject(options) {
    const projects = useSelector(getProjects);
    const match = useMatch('/:projectId/:locale/*');
    const routeShortname =
        match && isLocaleValid(match.params.locale)
            ? match.params.projectId
            : undefined;
    const legacyProject = routeShortname
        ? Object.values(projects || {}).find(
              (project) => project.shortname === routeShortname
          )
        : findProjectByDomain(projects);
    const shortname = routeShortname || legacyProject?.shortname;
    const details = useProjectDetail(
        options === undefined ? null : shortname,
        options
    );

    // TODO: Remove this legacy return path once all callers use the detail API.
    const project = options === undefined ? legacyProject : details.project;
    const identity = {
        project,
        projectShortname: shortname,
        // TODO: Replace this shortname alias with projectShortname in remaining callers.
        projectId: shortname,
        projectDbId: project?.id ?? legacyProject?.id,
        isUmbrella: project?.is_umbrella ?? legacyProject?.is_umbrella,
    };
    return options === undefined
        ? identity
        : {
              ...details,
              ...identity,
              isLoading: !shortname || details.isLoading,
          };
}
