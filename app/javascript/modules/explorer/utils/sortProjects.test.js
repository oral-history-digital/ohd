import { sortProjects } from './sortProjects';

describe('sortProjects', () => {
    test('sorts by name ascending while ignoring leading punctuation/quotes', () => {
        const projects = [
            { name: 'Beta' },
            { name: '„Name“' },
            { name: '“Apple”' },
            { name: '(Project)' },
            { name: 'Alpha' },
        ];

        const actual = sortProjects(projects, 'name_asc').map(
            (project) => project.name
        );

        expect(actual).toEqual([
            'Alpha',
            '“Apple”',
            'Beta',
            '„Name“',
            '(Project)',
        ]);
    });

    test('sorts by name descending while ignoring leading punctuation/quotes', () => {
        const projects = [
            { name: 'Beta' },
            { name: '„Name“' },
            { name: '“Apple”' },
            { name: '(Project)' },
            { name: 'Alpha' },
        ];

        const actual = sortProjects(projects, 'name_desc').map(
            (project) => project.name
        );

        expect(actual).toEqual([
            '(Project)',
            '„Name“',
            'Beta',
            '“Apple”',
            'Alpha',
        ]);
    });

    test('sorts by name ascending by default', () => {
        const projects = [
            { name: 'A', interviews: { total: 1 } },
            { name: 'B', interviews: { total: 5 } },
            { name: 'C' },
        ];

        const actual = sortProjects(projects).map((project) => project.name);

        expect(actual).toEqual(['A', 'B', 'C']);
    });

    test('sorts by collections ascending and treats missing totals as zero', () => {
        const projects = [
            { name: 'A', collections: { total: 2 } },
            { name: 'B' },
            { name: 'C', collections: { total: 1 } },
        ];

        const actual = sortProjects(projects, 'collections_asc').map(
            (project) => project.name
        );

        expect(actual).toEqual(['B', 'C', 'A']);
    });
});
