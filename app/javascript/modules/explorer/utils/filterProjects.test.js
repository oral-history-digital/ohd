import { filterProjects } from './filterProjects';

describe('filterProjects', () => {
    const projects = [
        {
            id: 1,
            name: 'Alpha Archive',
            display_name: 'The Alpha Project',
            shortname: 'AAP',
            description: 'Stories from the mountain region',
            introduction: 'A long-running oral history program',
            interviews: { total: 5 },
            collections: { total: 2 },
            institutions: [
                {
                    id: 10,
                    name: 'Main Institute',
                    parent: { id: 100, name: 'University One' },
                },
            ],
        },
        {
            id: 2,
            name: 'Beta Collection',
            shortname: 'BC',
            description: 'City memories',
            introduction: 'Urban narratives',
            interviews: { total: 12 },
            collections: { total: 5 },
            institutions: [
                {
                    id: 20,
                    name: 'City Museum',
                    parent: { id: 200, name: 'University Two' },
                },
            ],
        },
        {
            id: 3,
            name: 'Gamma Voices',
            shortname: 'GV',
            description: 'River basin interviews',
            introduction: 'Ecology and culture',
            interviews: { total: 0 },
            collections: { total: 0 },
            institutions: [],
        },
    ];

    test('returns all projects when no filters are active', () => {
        const actual = filterProjects(projects, '', null, null, null, null, []);

        expect(actual.map((project) => project.id)).toEqual([1, 2, 3]);
    });

    test('filters by text query across project and institution fields', () => {
        const byDisplayName = filterProjects(
            projects,
            'alpha',
            null,
            null,
            null,
            null,
            []
        );
        const byParentInstitution = filterProjects(
            projects,
            'university two',
            null,
            null,
            null,
            null,
            []
        );
        const byShortname = filterProjects(
            projects,
            'gv',
            null,
            null,
            null,
            null,
            []
        );

        expect(byDisplayName.map((project) => project.id)).toEqual([1]);
        expect(byParentInstitution.map((project) => project.id)).toEqual([2]);
        expect(byShortname.map((project) => project.id)).toEqual([3]);
    });

    test('applies inclusive interview count range', () => {
        const actual = filterProjects(projects, '', 5, 12, null, null, []);

        expect(actual.map((project) => project.id)).toEqual([1, 2]);
    });

    test('treats missing interview totals as zero', () => {
        const withMissingInterviews = [
            ...projects,
            {
                id: 4,
                name: 'Delta Narratives',
                collections: { total: 1 },
                institutions: [],
            },
        ];

        const actual = filterProjects(
            withMissingInterviews,
            '',
            null,
            0,
            null,
            null,
            []
        );

        expect(actual.map((project) => project.id)).toEqual([3, 4]);
    });

    test('applies inclusive collection count range', () => {
        const actual = filterProjects(projects, '', null, null, 2, 5, []);

        expect(actual.map((project) => project.id)).toEqual([1, 2]);
    });

    test('filters by institution ids including parent institutions', () => {
        const byDirectInstitution = filterProjects(
            projects,
            '',
            null,
            null,
            null,
            null,
            [10]
        );

        const byParentInstitution = filterProjects(
            projects,
            '',
            null,
            null,
            null,
            null,
            [200]
        );

        expect(byDirectInstitution.map((project) => project.id)).toEqual([1]);
        expect(byParentInstitution.map((project) => project.id)).toEqual([2]);
    });

    test('combines all active filters', () => {
        const actual = filterProjects(projects, 'city', 10, 12, 5, 5, [20]);

        expect(actual.map((project) => project.id)).toEqual([2]);
    });
});
