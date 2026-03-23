import { getArchiveUrl } from './getArchiveUrl';

describe('getArchiveUrl', () => {
    it('returns null when archive is missing', () => {
        expect(getArchiveUrl(null, 'de')).toBeNull();
    });

    it('returns null when locale is missing', () => {
        expect(getArchiveUrl({ shortname: 'foo' }, null)).toBeNull();
    });

    it('returns archive_domain when present', () => {
        const archive = {
            archive_domain: 'https://example.org',
            shortname: 'foo',
        };

        expect(getArchiveUrl(archive, 'de')).toBe('https://example.org');
    });

    it('returns fallback path from shortname and locale when archive_domain is absent', () => {
        const archive = { shortname: 'foo' };

        expect(getArchiveUrl(archive, 'de')).toBe('/foo/de');
    });
});
