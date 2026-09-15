import { parametrizedQuery } from './parametrizedQuery';

describe('parametrizedQuery', () => {
    test('sorts keys alphabetically and preserves values', () => {
        expect(parametrizedQuery({ page: 2, scope: 'projects' })).toBe(
            'page=2&scope=projects'
        );
        expect(parametrizedQuery({ scope: 'projects', page: 2 })).toBe(
            'page=2&scope=projects'
        );
    });

    test('returns an empty string for an empty query', () => {
        expect(parametrizedQuery({})).toBe('');
    });
});
