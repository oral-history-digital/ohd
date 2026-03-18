import getCurrentPageFromLocation from './getCurrentPageFromLocation';

/**
 * Builds a location-like object for page classification tests.
 */
function buildLocation(pathname, search = '') {
    return { pathname, search };
}

describe('getCurrentPageFromLocation', () => {
    it('classifies project startpage on archive domain route', () => {
        const result = getCurrentPageFromLocation(buildLocation('/de'));

        expect(result.pageType).toBe('project_startpage');
        expect(result.params).toEqual({
            locale: 'de',
            projectId: null,
        });
        expect(result.pathBase).toBe('/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies project startpage on shortname route', () => {
        const result = getCurrentPageFromLocation(buildLocation('/mog/de'));

        expect(result.pageType).toBe('project_startpage');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies interview detail and preserves archive id', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/mog/de/interviews/A-123')
        );

        expect(result.pageType).toBe('interview_detail');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
            archiveId: 'A-123',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies catalog detail and enriches catalog params', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/de/catalog/collections/90408866')
        );

        expect(result.pageType).toBe('catalog_page');
        expect(result.params).toEqual(
            expect.objectContaining({
                locale: 'de',
                projectId: null,
                catalogType: 'collections',
                id: '90408866',
            })
        );
        expect(result.pathBase).toBe('/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies static text pages and enriches static page code', () => {
        const result = getCurrentPageFromLocation(buildLocation('/de/contact'));

        expect(result.pageType).toBe('static_text_page');
        expect(result.params).toEqual({
            locale: 'de',
            projectId: null,
            staticPageCode: 'contact',
        });
        expect(result.pathBase).toBe('/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies project admin pages', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/mog/de/project/edit-config')
        );

        expect(result.pageType).toBe('project_admin_page');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies register page routes', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/mog/de/register')
        );

        expect(result.pageType).toBe('register_page');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies main-site search_archive subtype', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/de/searches/archive', '?sort=random')
        );

        expect(result.pageType).toBe('search_archive');
        expect(result.subtype).toBe('main_site_search');
        expect(result.params).toEqual({
            projectId: null,
            locale: 'de',
            collectionId: null,
        });
        expect(result.pathBase).toBe('/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies project search_archive subtype', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/adg/de/searches/archive')
        );

        expect(result.pageType).toBe('search_archive');
        expect(result.subtype).toBe('project_search');
        expect(result.params).toEqual({
            projectId: 'adg',
            locale: 'de',
            collectionId: null,
        });
        expect(result.pathBase).toBe('/adg/de');
        expect(result.isKnown).toBe(true);
    });

    it('classifies collection-filtered search_archive subtype', () => {
        const result = getCurrentPageFromLocation(
            buildLocation(
                '/adg/de/searches/archive',
                '?collection_id[]=21894736'
            )
        );

        expect(result.pageType).toBe('search_archive');
        expect(result.subtype).toBe('collection_search');
        expect(result.params).toEqual({
            projectId: 'adg',
            locale: 'de',
            collectionId: '21894736',
        });
        expect(result.pathBase).toBe('/adg/de');
        expect(result.isKnown).toBe(true);
    });

    it('returns unknown with extracted context when route is unmatched', () => {
        const result = getCurrentPageFromLocation(
            buildLocation('/mog/de/not-a-real-page', '?foo=bar')
        );

        expect(result.pageType).toBe('unknown');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.search).toBe('?foo=bar');
        expect(result.isKnown).toBe(false);
    });
});
