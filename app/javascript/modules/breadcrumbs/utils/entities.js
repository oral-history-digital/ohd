import { getLocalizedValue } from './locale';

/**
 * Returns parent archive information for a catalog collection detail page.
 */
export function getCatalogCollectionParentProject(itemId, context) {
    const { locale, collection, collectionParentProject } = context;

    if (String(collection?.id) !== String(itemId)) {
        return null;
    }

    const projectId = collection?.project_id;
    if (!projectId) {
        return null;
    }

    const collectionProjectLabel =
        getLocalizedValue(
            collection?.project_display_name,
            locale,
            collection?.default_locale
        ) ||
        getLocalizedValue(
            collection?.project_name,
            locale,
            collection?.default_locale
        ) ||
        collection?.project_shortname ||
        null;

    if (collectionProjectLabel) {
        return {
            projectId: projectId,
            projectLabel: collectionProjectLabel,
            loading: false,
        };
    }

    const project =
        String(collectionParentProject?.id) === String(projectId)
            ? collectionParentProject
            : null;
    if (!project) {
        return {
            projectId: projectId,
            projectLabel: null,
            loading: true,
        };
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
        return {
            projectId: projectId,
            projectLabel: null,
            loading: true,
        };
    }

    return {
        projectId: projectId,
        projectLabel: projectLabel,
        loading: false,
    };
}
