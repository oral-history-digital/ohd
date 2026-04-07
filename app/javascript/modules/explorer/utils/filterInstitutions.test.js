import { filterInstitutions } from './filterInstitutions';

describe('filterInstitutions', () => {
    const institutions = [
        {
            id: 1,
            name: 'Top One',
            parent: { id: null, name: null },
            children: [{ id: 2, name: 'Child One' }],
            interviews: { total: 10 },
            archives: [{ id: 1, name: 'Archive A' }],
        },
        {
            id: 2,
            name: 'Child One',
            parent: { id: 1, name: 'Top One' },
            children: [],
            interviews: { total: 4 },
            archives: [{ id: 2, name: 'Archive B' }],
        },
        {
            id: 3,
            name: 'Top Two',
            parent: { id: null, name: null },
            children: [],
            interviews: { total: 2 },
            archives: [{ id: 3, name: 'Archive C' }],
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

    test('filters to with_children-level institutions', () => {
        const actual = filterInstitutions(
            institutions,
            '',
            null,
            null,
            null,
            null,
            'with_children'
        );

        expect(actual.map((i) => i.id)).toEqual([1]);
    });

    test('filters to child institutions', () => {
        const actual = filterInstitutions(
            institutions,
            '',
            null,
            null,
            null,
            null,
            'with_parent'
        );

        expect(actual.map((i) => i.id)).toEqual([2]);
    });

    test('combines hierarchy with query filter', () => {
        const actual = filterInstitutions(
            institutions,
            'with_children',
            null,
            null,
            null,
            null,
            'with_parent'
        );

        expect(actual).toEqual([]);
    });
});
