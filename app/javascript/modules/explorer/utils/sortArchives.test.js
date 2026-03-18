import { sortArchives } from './sortArchives';

describe('sortArchives', () => {
    test('sorts by name ascending while ignoring leading punctuation/quotes', () => {
        const archives = [
            { name: 'Beta' },
            { name: '„Name“' },
            { name: '“Apple”' },
            { name: '(Archive)' },
            { name: 'Alpha' },
        ];

        const actual = sortArchives(archives, 'name_asc').map(
            (archive) => archive.name
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
        const archives = [
            { name: 'Beta' },
            { name: '„Name“' },
            { name: '“Apple”' },
            { name: '(Archive)' },
            { name: 'Alpha' },
        ];

        const actual = sortArchives(archives, 'name_desc').map(
            (archive) => archive.name
        );

        expect(actual).toEqual([
            '„Name“',
            'Beta',
            '(Archive)',
            '“Apple”',
            'Alpha',
        ]);
    });

    test('sorts by interviews descending by default', () => {
        const archives = [
            { name: 'A', interviews: { total: 1 } },
            { name: 'B', interviews: { total: 5 } },
            { name: 'C' },
        ];

        const actual = sortArchives(archives).map((archive) => archive.name);

        expect(actual).toEqual(['B', 'A', 'C']);
    });

    test('sorts by collections ascending and treats missing totals as zero', () => {
        const archives = [
            { name: 'A', collections: { total: 2 } },
            { name: 'B' },
            { name: 'C', collections: { total: 1 } },
        ];

        const actual = sortArchives(archives, 'collections_asc').map(
            (archive) => archive.name
        );

        expect(actual).toEqual(['B', 'C', 'A']);
    });
});
