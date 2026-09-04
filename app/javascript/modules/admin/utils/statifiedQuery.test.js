import { statifiedQuery } from './statifiedQuery';

describe('statifiedQuery', () => {
    test('replaces query separators with underscores', () => {
        expect(statifiedQuery({ page: 2, scope: 'projects' })).toBe(
            'page_2_scope_projects'
        );
    });

    test('returns an empty string for an empty query', () => {
        expect(statifiedQuery({})).toBe('');
    });
});
