import tabIndexFromRoute from './tabIndexFromRoute';
import { INDEX_USER, INDEX_NONE } from './constants';

test('returns tab index for a route', () => {
    const actual = tabIndexFromRoute('/de', '/de/users/current');
    const expected = INDEX_USER;
    expect(actual).toEqual(expected);
});

describe('for home route', () => {
    test('returns tab index for campscapes project', () => {
        const actual = tabIndexFromRoute('/de', '/de', true);
        const expected = INDEX_NONE;
        expect(actual).toEqual(expected);
    });

    test('returns tab index for other projects', () => {
        const actual = tabIndexFromRoute('/de', '/de', false);
        const expected = INDEX_USER;
        expect(actual).toEqual(expected);
    });
});
