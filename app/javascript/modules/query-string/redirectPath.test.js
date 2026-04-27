import {
    pathWithoutInternalSessionFlag,
    removeQueryParamFromPath,
    sanitizeInternalReturnPath,
} from './redirectPath';

describe('removeQueryParamFromPath', () => {
    test('removes target param and keeps others', () => {
        expect(
            removeQueryParamFromPath(
                '/en/searches/archive?sort=random&checked_ohd_session=true',
                'checked_ohd_session'
            )
        ).toBe('/en/searches/archive?sort=random');
    });

    test('returns original path when query is missing', () => {
        expect(
            removeQueryParamFromPath(
                '/en/searches/archive',
                'checked_ohd_session'
            )
        ).toBe('/en/searches/archive');
    });

    test('returns input unchanged when path is nullish', () => {
        expect(
            removeQueryParamFromPath(null, 'checked_ohd_session')
        ).toBeNull();
        expect(
            removeQueryParamFromPath(undefined, 'checked_ohd_session')
        ).toBeUndefined();
    });
});

describe('sanitizeInternalReturnPath', () => {
    test('removes internal handshake param', () => {
        expect(
            sanitizeInternalReturnPath(
                '/en/searches/archive?sort=random&checked_ohd_session=true'
            )
        ).toBe('/en/searches/archive?sort=random');
    });

    test('returns fallback for invalid path', () => {
        expect(sanitizeInternalReturnPath('https://evil.example/path')).toBe(
            '/'
        );
        expect(sanitizeInternalReturnPath('//evil.example/path')).toBe('/');
        expect(sanitizeInternalReturnPath('', '/en')).toBe('/en');
    });

    test('returns custom fallback when provided', () => {
        expect(sanitizeInternalReturnPath(null, null)).toBeNull();
    });
});

describe('pathWithoutInternalSessionFlag', () => {
    test('removes internal flag and preserves other query params', () => {
        expect(
            pathWithoutInternalSessionFlag(
                '/en/searches/archive',
                '?sort=random&checked_ohd_session=true'
            )
        ).toBe('/en/searches/archive?sort=random');
    });

    test('returns pathname when only internal flag is present', () => {
        expect(
            pathWithoutInternalSessionFlag(
                '/en/searches/archive',
                '?checked_ohd_session=true'
            )
        ).toBe('/en/searches/archive');
    });
});
