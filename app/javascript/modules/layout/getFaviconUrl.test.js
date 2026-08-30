import getFaviconUrl from './getFaviconUrl';

test('uses the configured project favicon', () => {
    expect(
        getFaviconUrl({
            shortname: 'archive',
            favicon_url: '/rails/active_storage/blobs/favicon',
        })
    ).toBe('/rails/active_storage/blobs/favicon');
});

test('falls back to the legacy archive favicon', () => {
    expect(getFaviconUrl({ shortname: 'archive' })).toBe(
        '/favicons/favicon-archive.ico'
    );
});

test('falls back to the main favicon for the hardcoded OHD project', () => {
    expect(getFaviconUrl({ shortname: 'ohd' })).toBe('/favicon.ico');
});
