import { matchPath } from 'react-router-dom';

import { PAGE_DEFINITIONS, STATIC_TEXT_PAGE_CODES } from './pageDefinitions';

/**
 * Normalizes a pathname by removing trailing slashes (except for root).
 */
function normalizePathname(pathname) {
    if (!pathname || pathname === '/') {
        return '/';
    }

    return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

/**
 * Returns the base project/locale prefix used to build internal links.
 */
function getPathBase({ locale, projectId }) {
    if (!locale) {
        return null;
    }

    return projectId ? `/${projectId}/${locale}` : `/${locale}`;
}

/**
 * Enriches matched params with page-specific metadata.
 */
function enrichParamsForPage(pageType, params, pathname) {
    if (pageType === 'catalog_page') {
        const segments = normalizePathname(pathname).split('/').filter(Boolean);
        const catalogIndex = segments.findIndex(
            (segment) => segment === 'catalog'
        );

        return {
            ...params,
            catalogType:
                catalogIndex >= 0 ? segments[catalogIndex + 1] || 'root' : null,
            id: catalogIndex >= 0 ? segments[catalogIndex + 2] || null : null,
        };
    }

    if (pageType === 'static_text_page') {
        const staticPageCode = STATIC_TEXT_PAGE_CODES.find((code) =>
            normalizePathname(pathname).endsWith(`/${code}`)
        );

        return {
            ...params,
            staticPageCode: staticPageCode || null,
        };
    }

    return params;
}

/**
 * Finds the first matching page definition for the current pathname.
 */
function matchCurrentPage(pathname) {
    const normalizedPathname = normalizePathname(pathname);

    for (const definition of PAGE_DEFINITIONS) {
        for (const pattern of definition.patterns) {
            const match = matchPath(
                { path: pattern, end: true },
                normalizedPathname
            );
            if (match) {
                return {
                    definition,
                    params: match.params,
                };
            }
        }
    }

    return null;
}

/**
 * Classifies the current location into a normalized page context object.
 */
export default function getCurrentPageFromLocation({ pathname, search = '' }) {
    const normalizedPathname = normalizePathname(pathname);
    const matched = matchCurrentPage(normalizedPathname);

    if (matched) {
        const { definition, params } = matched;
        const enrichedParams = enrichParamsForPage(
            definition.pageType,
            {
                ...params,
                projectId: params.projectId || null,
                locale: params.locale || null,
            },
            normalizedPathname
        );

        return {
            pageType: definition.pageType,
            subtype: definition.subtype || null,
            params: enrichedParams,
            pathBase: getPathBase(enrichedParams),
            pathname: normalizedPathname,
            search,
            isKnown: true,
        };
    }

    // Fallback: attempt to extract projectId and locale even if page type is unknown

    const projectLocaleMatch = matchPath(
        { path: '/:projectId/:locale/*', end: false },
        normalizedPathname
    );
    const localeMatch = matchPath(
        { path: '/:locale/*', end: false },
        normalizedPathname
    );

    const fallbackParams =
        projectLocaleMatch?.params || localeMatch?.params || {};

    return {
        pageType: 'unknown',
        subtype: null,
        params: {
            projectId: fallbackParams.projectId || null,
            locale: fallbackParams.locale || null,
        },
        pathBase: getPathBase(fallbackParams),
        pathname: normalizedPathname,
        search,
        isKnown: false,
    };
}
