import { getLocalizedValue } from './locale';

/**
 * Returns parent archive information for a catalog collection detail page.
 */
export function getCatalogCollectionParentArchive(itemId, context) {
    const { locale, collections, projects } = context;

    const collection = collections[itemId];
    const archiveId = collection?.project_id;
    if (!archiveId) {
        return null;
    }

    const archive = projects[archiveId];
    if (!archive) {
        return null;
    }

    const archiveLabel =
        getLocalizedValue(
            archive.display_name,
            locale,
            archive.default_locale
        ) ||
        getLocalizedValue(archive.name, locale, archive.default_locale) ||
        archive.shortname ||
        null;

    if (!archiveLabel) {
        return null;
    }

    return {
        archiveId,
        archiveLabel,
    };
}
