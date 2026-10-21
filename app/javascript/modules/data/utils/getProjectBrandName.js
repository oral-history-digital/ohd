import { localizedValue } from 'modules/utils';

/**
 * Formats a localized project name with its optional display shortname.
 * @param {Object} project - Display details or a legacy translated project.
 * @param {string} locale - Locale used when reading legacy translations.
 * @returns {string|null} Human-readable brand name, or null without a name.
 */
export function getProjectBrandName(project, locale) {
    const name =
        localizedValue(project?.name, locale) ||
        localizedValue(project?.display_name, locale);

    if (!name) return null;

    return project.display_shortname
        ? `${name} (${project.display_shortname})`
        : name;
}
