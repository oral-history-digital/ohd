import { useMemo } from 'react';

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
 * counts, institutions, languages, and collection previews. Adds the field names
 * expected by existing catalog components without storing those aliases in Redux.
 *
 * @param {Object} [options={}] - Controls automatic fetching for hidden sidebar filters.
 * @param {boolean} [options.enabled=true] - Fetch automatically while catalog filters are shown.
 * @returns {ProjectListResult}
 * Project list and request status, with interviews, collections, and languages_interviews aliases.
 */
export function useCatalogProjects({ enabled = true } = {}) {
    const result = useProjectList({ all: true, include, enabled });
    // Keep existing catalog controls compatible; Redux retains the v2 field names.
    const projects = useMemo(
        () =>
            result.projects.map((project) => ({
                ...project,
                // TODO: Update catalog/explorer consumers to use v2 field names, then remove these aliases.
                interviews: project.interview_counts,
                collections: project.collection_counts,
                languages_interviews: project.interview_languages,
            })),
        [result.projects]
    );
    return { ...result, projects };
}
