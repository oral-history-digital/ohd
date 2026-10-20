import { getProjects, useProjectDetail } from 'modules/data';
import { useSelector } from 'react-redux';

import useProjectIdentity from './useProjectIdentity';

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
    const { projectShortname, projectDbId, isUmbrella } = useProjectIdentity();
    const projects = useSelector(getProjects);
    const legacyProject = projects?.[projectDbId];
    const details = useProjectDetail(
        options === undefined ? null : projectShortname,
        options
    );

    // TODO: Remove this legacy return path once all callers use the detail API.
    const project = options === undefined ? legacyProject : details.project;
    const identity = {
        project,
        projectShortname,
        // TODO: Replace this shortname alias with projectShortname in remaining callers.
        projectId: projectShortname,
        projectDbId: project?.id ?? projectDbId,
        isUmbrella: project?.is_umbrella ?? isUmbrella,
    };
    return options === undefined
        ? identity
        : {
              ...details,
              ...identity,
              isLoading: !projectShortname || details.isLoading,
          };
}
