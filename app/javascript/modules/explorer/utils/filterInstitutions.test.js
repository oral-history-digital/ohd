import { filterInstitutions } from './filterInstitutions';

describe('filterInstitutions', () => {
    const institutions = [
        {
            id: 1,
            name: 'Top One',
            parent: { id: null, name: null },
            children: [{ id: 2, name: 'Child One' }],
            interviews: { total: 10 },
            projects: [{ id: 1, name: 'Project A' }],
        },
        {
            id: 2,
            name: 'Child One',
            parent: { id: 1, name: 'Top One' },
            children: [],
            interviews: { total: 4 },
            projects: [{ id: 2, name: 'Project B' }],
        },
        {
            id: 3,
            name: 'Top Two',
            parent: { id: null, name: null },
            children: [],
            interviews: { total: 2 },
            projects: [{ id: 3, name: 'Project C' }],
        },
    ];

    test('returns all institutions by default level', () => {
        const actual = filterInstitutions(
            institutions,
            '',
            null,
            null,
            null,
            null
        );

        expect(actual.map((i) => i.id)).toEqual([1, 2, 3]);
    });

    test('filters to top-level institutions', () => {
        const actual = filterInstitutions(
            institutions,
            '',
            null,
            null,
            null,
            null,
            'top_level'
        );

        expect(actual.map((i) => i.id)).toEqual([1, 3]);
    });

    test('combines hierarchy with query filter', () => {
        const actual = filterInstitutions(
            institutions,
            'top',
            null,
            null,
            null,
            null,
            'top_level'
        );

        expect(actual.map((i) => i.id)).toEqual([1, 3]);
    });
});
