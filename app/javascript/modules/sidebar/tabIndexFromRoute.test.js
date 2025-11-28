import { INDEX_NONE, INDEX_SEARCH } from './constants';
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
