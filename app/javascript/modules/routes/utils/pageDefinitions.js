const STATIC_TEXT_PAGE_CODES = [
    'conditions',
    'ohd_conditions',
    'privacy_protection',
    'contact',
    'legal_info',
];

const PROJECT_ADMIN_PATTERNS = [
    '/project/edit-info',
    '/project/edit-config',
    '/project/edit-access-config',
    '/project/edit-display',
    '/metadata_fields',
    '/people',
    '/event_types',
    '/registry_reference_types',
    '/registry_name_types',
    '/contribution_types',
    '/languages',
    '/translation_values',
    '/roles',
    '/permissions',
    '/task_types',
    '/uploads/new',
];

/**
 * Builds route patterns for both project-prefixed and plain locale URL styles.
 */
function withProjectAndLocale(suffix, { wildcard = false } = {}) {
    const basePattern = suffix ? `${suffix}` : '';
    const root = basePattern || '';

    const projectPattern = wildcard
        ? `/:projectId/:locale${root}/*`
        : `/:projectId/:locale${root}`;
    const plainPattern = wildcard ? `/:locale${root}/*` : `/:locale${root}`;

    return [projectPattern, plainPattern];
}

const PAGE_DEFINITIONS = [
    {
        pageType: 'interview_detail',
        patterns: withProjectAndLocale('/interviews/:archiveId'),
    },
    {
        pageType: 'search_archive',
        patterns: withProjectAndLocale('/searches/archive'),
    },
    {
        pageType: 'search_map',
        patterns: withProjectAndLocale('/searches/map'),
    },
    {
        pageType: 'register_page',
        patterns: withProjectAndLocale('/register'),
    },
    {
        pageType: 'registry_entries',
        patterns: withProjectAndLocale('/registry_entries'),
    },
    {
        pageType: 'collections',
        patterns: withProjectAndLocale('/collections'),
    },
    {
        pageType: 'user_page',
        subtype: 'account',
        patterns: withProjectAndLocale('/users/current'),
    },
    {
        pageType: 'user_page',
        subtype: 'password_new',
        patterns: withProjectAndLocale('/users/password/new'),
    },
    {
        pageType: 'user_page',
        subtype: 'password_edit',
        patterns: withProjectAndLocale('/users/password/edit'),
    },
    {
        pageType: 'user_page',
        subtype: 'users_admin',
        patterns: withProjectAndLocale('/users'),
    },
    {
        pageType: 'project_admin_page',
        patterns: PROJECT_ADMIN_PATTERNS.flatMap((pattern) =>
            withProjectAndLocale(pattern)
        ),
    },
    {
        pageType: 'static_text_page',
        patterns: STATIC_TEXT_PAGE_CODES.flatMap((code) =>
            withProjectAndLocale(`/${code}`)
        ),
    },
    {
        pageType: 'catalog_page',
        patterns: ['/:locale/catalog', '/:locale/catalog/*'],
    },
    {
        pageType: 'project_startpage',
        patterns: withProjectAndLocale(''),
    },
];

export {
    PAGE_DEFINITIONS,
    PROJECT_ADMIN_PATTERNS,
    STATIC_TEXT_PAGE_CODES,
    withProjectAndLocale,
};
