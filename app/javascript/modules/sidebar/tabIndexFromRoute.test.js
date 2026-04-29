import {
    INDEX_ADMINISTRATION,
    INDEX_CATALOG_INSTITUTIONS,
    INDEX_NONE,
    INDEX_SEARCH,
} from './constants';
import tabIndexFromRoute from './tabIndexFromRoute';

test('returns tab index for a route', () => {
    const actual = tabIndexFromRoute('/de', '/de/searches/archive');
    const expected = INDEX_SEARCH;
    expect(actual).toEqual(expected);
});

test('returns none tab index for home route', () => {
    const actual = tabIndexFromRoute('/de', '/de');
    const expected = INDEX_NONE;
    expect(actual).toEqual(expected);
});

test('returns administration tab index for admin instance route', () => {
    const actual = tabIndexFromRoute('/de', '/de/admin/instance');
    const expected = INDEX_ADMINISTRATION;
    expect(actual).toEqual(expected);
});

test('returns catalog institutions tab index for catalog institutions route', () => {
    const actual = tabIndexFromRoute('/de', '/de/catalog/institutions/15');
    const expected = INDEX_CATALOG_INSTITUTIONS;
    expect(actual).toEqual(expected);
});
