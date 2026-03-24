import { getLocalizedValue, translateWithFallback } from './locale';
import { humanizeSegment } from './path';

export const STATIC_PAGE_CODES = [
    'conditions',
    'ohd_conditions',
    'privacy_protection',
    'contact',
    'legal_info',
];

export const CATALOG_TYPE_KEYS = {
    root: 'modules.catalog.breadcrumb_title',
    institutions: 'activerecord.models.institution.other',
    archives: 'activerecord.models.project.other',
    collections: 'activerecord.models.collection.other',
};

/**
 * Returns the current archive label from project display/name values.
 */
export function getProjectLabel(project, locale) {
    if (!project) {
        return null;
    }

    const defaultLocale = project.default_locale;
    return (
        getLocalizedValue(project.display_name, locale, defaultLocale) ||
        getLocalizedValue(project.name, locale, defaultLocale) ||
        project.shortname || // TODO: Fall back to translated string for "Archive", not shortname
        null
    );
}

/**
 * Returns the interview breadcrumb label from loaded interview data.
 */
export function getInterviewLabel(interview, locale, canShowFullTitle) {
    if (!interview) {
        return null;
    }

    const defaultLocale = interview.default_locale;

    const shortTitle = getLocalizedValue(
        interview.short_title,
        locale,
        defaultLocale
    );
    const anonymousTitle = getLocalizedValue(
        interview.anonymous_title,
        locale,
        defaultLocale
    );

    if (canShowFullTitle) {
        return (
            shortTitle ||
            anonymousTitle ||
            getLocalizedValue(interview.title, locale, defaultLocale) ||
            getLocalizedValue(interview.name, locale, defaultLocale) ||
            null
        );
    }

    return anonymousTitle || shortTitle || interview.archive_id || null;
}

/**
 * Returns a localized collection name for the interview collection.
 */
export function getInterviewCollectionLabel(
    interview,
    collectionsById,
    locale
) {
    if (!interview?.collection_id) {
        return null;
    }

    const collection = collectionsById[interview.collection_id];
    if (!collection) {
        return null;
    }

    return getLocalizedValue(
        collection.name,
        locale,
        collection.default_locale
    );
}

/**
 * Returns a localized catalog item label from loaded domain data.
 */
export function getCatalogItemLabel(catalogType, itemId, context) {
    const { locale, collections, institutions, projects } = context;

    if (!itemId) {
        return null;
    }

    if (catalogType === 'archives') {
        const archive = projects[itemId];
        return (
            getLocalizedValue(
                archive?.display_name,
                locale,
                archive?.default_locale
            ) ||
            getLocalizedValue(archive?.name, locale, archive?.default_locale) ||
            archive?.shortname ||
            null
        );
    }

    if (catalogType === 'collections') {
        const collection = collections[itemId];
        return getLocalizedValue(
            collection?.name,
            locale,
            collection?.default_locale
        );
    }

    if (catalogType === 'institutions') {
        const institution = institutions[itemId];
        return getLocalizedValue(
            institution?.name,
            locale,
            institution?.default_locale
        );
    }

    return null;
}

/**
 * Builds default labels using translation keys with safe fallbacks.
 */
export function buildDefaultLabels(t) {
    return {
        home: translateWithFallback(t, 'home', 'Home'),
        interview_detail: translateWithFallback(
            t,
            'activerecord.models.interview.one',
            'Interview'
        ),
        collections: translateWithFallback(
            t,
            'activerecord.models.collection.other',
            'Collections'
        ),
        search_archive: translateWithFallback(t, 'interviews', 'Search'),
        search_map: translateWithFallback(
            t,
            'modules.search_map.title',
            'Map Search'
        ),
        registry_entries: translateWithFallback(
            t,
            'activerecord.models.registry_entry.other',
            'Registry Entries'
        ),
        static_text_page: 'Page', // TODO: Add specific translation keys for each static page type
        user_page: translateWithFallback(t, 'edit.users.admin', 'Users'),
        project_admin_page: translateWithFallback(
            t,
            'edit.administration',
            'Administration'
        ),
        register_page: translateWithFallback(
            t,
            'user.registration',
            'Register'
        ),
        catalog_page: translateWithFallback(
            t,
            'modules.catalog.breadcrumb_title',
            'Catalog'
        ),
    };
}

/**
 * Builds translated labels for static text page codes.
 */
export function buildStaticPageLabels(t) {
    return STATIC_PAGE_CODES.reduce((acc, code) => {
        acc[code] = translateWithFallback(t, code, humanizeSegment(code));
        return acc;
    }, {});
}

/**
 * Builds translated labels for catalog subtypes.
 */
export function buildCatalogTypeLabels(t) {
    return Object.entries(CATALOG_TYPE_KEYS).reduce((acc, [type, key]) => {
        acc[type] = translateWithFallback(t, key, humanizeSegment(type));
        return acc;
    }, {});
}
