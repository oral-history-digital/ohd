import { useProjectDetail } from 'modules/data';

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
 * Loads the current project's display or editing details through Redux, using its route or domain.
 * Bootstrap supplies routing identity only; project data stays unavailable until the requested details load.
 *
 * @param {ProjectDetailOptions} [options={}] - Locale, profile, and optional includes.
 * @returns {ProjectIdentity & ProjectDetailResult} Project identity, requested details, request status, and refresh.
 */
export default function useProject(options = {}) {
    const { projectShortname, projectDbId, isUmbrella } = useProjectIdentity();
    const details = useProjectDetail(projectShortname, options);
    const project = details.project;
    return {
        ...details,
        projectShortname,
        // TODO: Replace this shortname alias with projectShortname in remaining callers.
        projectId: projectShortname,
        projectDbId: project?.id ?? projectDbId,
        isUmbrella: project?.is_umbrella ?? isUmbrella,
        isLoading: !projectShortname || details.isLoading,
    };
}
