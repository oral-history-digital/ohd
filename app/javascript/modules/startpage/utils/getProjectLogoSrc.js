/**
 * Returns the appropriate logo source URL for a project based on the current locale.
 * It first checks for a logo matching the current locale, then falls back to the default locale.
 * If no suitable logo is found, it returns null.
 *
 * @param {Object} project - The project object containing logos and default locale information.
 * @param {string} locale - The current locale to match against the logos.
 * @returns {string|null} - The source URL of the appropriate logo or null if none found.
 */

export function getProjectLogoSrc(project, locale) {
    const logos = project?.logos;

    if (!logos || Object.keys(logos).length === 0) return null;

    const logoArray = Object.values(logos).filter((logo) => logo?.src);

    if (logoArray.length === 0) return null;

    const logoForLocale = logoArray.find((logo) => logo.locale === locale);
    const logoForDefaultLocale = logoArray.find(
        (logo) => logo.locale === project?.default_locale
    );

    return logoForLocale?.src || logoForDefaultLocale?.src || null;
}

export default getProjectLogoSrc;
