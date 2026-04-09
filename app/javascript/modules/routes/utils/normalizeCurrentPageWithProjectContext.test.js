import normalizeCurrentPageWithProjectContext from './normalizeCurrentPageWithProjectContext';

function buildCurrentPage(overrides = {}) {
    return {
        pageType: 'project_startpage',
        subtype: null,
        params: {
            locale: 'de',
            projectShortname: null,
        },
        pathBase: '/de',
        pathname: '/de',
        search: '',
        isKnown: true,
        ...overrides,
    };
}

describe('normalizeCurrentPageWithProjectContext', () => {
    it('maps OHD locale root to site_startpage and keeps project identifiers null', () => {
        const result = normalizeCurrentPageWithProjectContext(
            buildCurrentPage(),
            {
                isOhd: true,
                projectShortname: 'ohd',
                projectId: 21894749,
            }
        );

        expect(result.pageType).toBe('site_startpage');
        expect(result.params).toEqual({
            locale: 'de',
            projectShortname: null,
            projectId: null,
        });
    });

    it('keeps route project shortname as source of truth', () => {
        const result = normalizeCurrentPageWithProjectContext(
            buildCurrentPage({
                pageType: 'interview_detail',
                params: {
                    locale: 'de',
                    projectShortname: 'mog',
                    archiveId: 'ARC-1',
                },
                pathBase: '/mog/de',
                pathname: '/mog/de/interviews/ARC-1',
            }),
            {
                isOhd: false,
                projectShortname: 'other',
                projectId: 99,
            }
        );

        expect(result.params).toEqual({
            locale: 'de',
            projectShortname: 'mog',
            projectId: 99,
            archiveId: 'ARC-1',
        });
    });

    it('falls back to project context outside OHD locale root routes', () => {
        const result = normalizeCurrentPageWithProjectContext(
            buildCurrentPage({
                pageType: 'static_text_page',
                params: {
                    locale: 'de',
                    projectShortname: null,
                    staticPageCode: 'contact',
                },
                pathname: '/de/contact',
            }),
            {
                isOhd: false,
                projectShortname: 'mog',
                projectId: 42,
            }
        );

        expect(result.pageType).toBe('static_text_page');
        expect(result.params).toEqual({
            locale: 'de',
            projectShortname: 'mog',
            projectId: 42,
            staticPageCode: 'contact',
        });
    });
});
