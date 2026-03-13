import { sortInstitutions } from './sortInstitutions';

describe('sortInstitutions', () => {
    test('sorts by name ascending by default while ignoring leading punctuation/quotes', () => {
        const institutions = [
            { name: 'Beta' },
            { name: '„Name“' },
            { name: '“Apple”' },
            { name: '(Archive)' },
            { name: 'Alpha' },
        ];

        const actual = sortInstitutions(institutions).map(
            (institution) => institution.name
        );

        expect(actual).toEqual([
            'Alpha',
            '“Apple”',
            '(Archive)',
            'Beta',
            '„Name“',
        ]);
    });

    test('sorts by name descending while ignoring leading punctuation/quotes', () => {
        const institutions = [
            { name: 'Beta' },
            { name: '„Name“' },
            { name: '“Apple”' },
            { name: '(Archive)' },
            { name: 'Alpha' },
        ];

        const actual = sortInstitutions(institutions, 'name_desc').map(
            (institution) => institution.name
        );

        expect(actual).toEqual([
            '„Name“',
            'Beta',
            '(Archive)',
            '“Apple”',
            'Alpha',
        ]);
    });

    test('sorts by archives ascending and treats missing archives as zero', () => {
        const institutions = [
            { name: 'A', archives: [{ id: 1 }, { id: 2 }] },
            { name: 'B' },
            { name: 'C', archives: [{ id: 3 }] },
        ];

        const actual = sortInstitutions(institutions, 'archives_asc').map(
            (institution) => institution.name
        );

        expect(actual).toEqual(['B', 'C', 'A']);
    });

    test('sorts by collections descending and treats missing totals as zero', () => {
        const institutions = [
            { name: 'A', collections: { total: 2 } },
            { name: 'B' },
            { name: 'C', collections: { total: 5 } },
        ];

        const actual = sortInstitutions(institutions, 'collections_desc').map(
            (institution) => institution.name
        );

        expect(actual).toEqual(['C', 'A', 'B']);
    });

    test('sorts by interviews descending and treats missing totals as zero', () => {
        const institutions = [
            { name: 'A', interviews: { total: 1 } },
            { name: 'B' },
            { name: 'C', interviews: { total: 3 } },
        ];

        const actual = sortInstitutions(institutions, 'interviews_desc').map(
            (institution) => institution.name
        );

        expect(actual).toEqual(['C', 'A', 'B']);
    });
});
