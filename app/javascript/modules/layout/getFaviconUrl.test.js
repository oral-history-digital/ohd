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

test('falls back to the main favicon for the configured umbrella', () => {
    expect(getFaviconUrl({ shortname: 'shared', is_umbrella: true })).toBe(
        '/favicon.ico'
    );
});

test('uses the legacy archive favicon for a non-umbrella project named ohd', () => {
    expect(getFaviconUrl({ shortname: 'ohd', is_umbrella: false })).toBe(
        '/favicons/favicon-ohd.ico'
    );
});

test('configured umbrella favicon takes precedence over the fallback', () => {
    expect(
        getFaviconUrl({
            shortname: 'shared',
            is_umbrella: true,
            favicon_url: '/custom.ico',
        })
    ).toBe('/custom.ico');
});

test('falls back to the main favicon without project data', () => {
    expect(getFaviconUrl()).toBe('/favicon.ico');
});
