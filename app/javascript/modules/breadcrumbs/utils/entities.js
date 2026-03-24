import { getLocalizedValue } from './locale';

/**
 * Returns parent archive information for a catalog collection detail page.
 */
export function getCatalogCollectionParentProject(itemId, context) {
    const { locale, collections, projects } = context;

    const collection = collections[itemId];
    const projectId = collection?.project_id;
    if (!projectId) {
        return null;
    }

    const project = projects[projectId];
    if (!project) {
        return null;
    }

    const projectLabel =
        getLocalizedValue(
            project.display_name,
            locale,
            project.default_locale
        ) ||
        getLocalizedValue(project.name, locale, project.default_locale) ||
        project.shortname ||
        null;

    if (!projectLabel) {
        return null;
    }

    return {
        projectId: projectId,
        projectLabel: projectLabel,
    };
}
