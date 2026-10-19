import { useProjectList } from 'modules/data';

/** @typedef {import('../../data/hooks/useProjectList').ProjectListResult} ProjectListResult */

const include = [
    'counts',
    'institutions',
    'interview_languages',
    'collection_preview',
];

/**
 * Reads catalog projects through Redux, fetching all policy-visible projects with
 * counts, institutions, languages, and collection previews.
 *
 * @param {Object} [options={}] - Controls automatic fetching for hidden sidebar filters.
 * @param {boolean} [options.enabled=true] - Fetch automatically while catalog filters are shown.
 * @returns {ProjectListResult}
 * Project list in the v2 field shape, request status, and explicit refresh function.
 */
export function useCatalogProjects({ enabled = true } = {}) {
    return useProjectList({ all: true, include, enabled });
}
