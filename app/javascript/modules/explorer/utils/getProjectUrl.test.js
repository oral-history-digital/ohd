import { getProjectUrl } from './getProjectUrl';

describe('getProjectUrl', () => {
    it('returns an empty link state when project is missing', () => {
        expect(getProjectUrl(null, 'de')).toEqual({
            url: null,
            isExternalUrl: false,
        });
    });

    it('returns null when locale is missing', () => {
        expect(getProjectUrl({ shortname: 'foo' }, null)).toEqual({
            url: null,
            isExternalUrl: false,
        });
    });

    it('returns archive_domain when present', () => {
        const project = {
            archive_domain: 'https://example.org',
            shortname: 'foo',
        };

        expect(getProjectUrl(project, 'de')).toEqual({
            url: 'https://example.org',
            isExternalUrl: true,
        });
    });

    it('returns fallback path from shortname and locale when archive_domain is absent', () => {
        const project = { shortname: 'foo' };

        expect(getProjectUrl(project, 'de')).toEqual({
            url: '/foo/de',
            isExternalUrl: false,
        });
    });
});
