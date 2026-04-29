import { filterCollections } from './filterCollections';

describe('filterCollections', () => {
    const collections = [
        {
            id: 1,
            name: 'Mountain Stories',
            institution: { name: 'Alpine Archive' },
            notes: 'Recorded between 1960 and 1980',
        },
        {
            id: 2,
            name: 'City Voices',
            institution: { name: 'Urban Museum' },
            notes: 'Focus on migration histories',
        },
        {
            id: 3,
            name: 'River Memories',
            institution: null,
            notes: null,
        },
    ];

    test('returns all collections when query is empty', () => {
        const actual = filterCollections(collections, '');

        expect(actual.map((collection) => collection.id)).toEqual([1, 2, 3]);
    });

    test('returns all collections when query is null', () => {
        const actual = filterCollections(collections, null);

        expect(actual.map((collection) => collection.id)).toEqual([1, 2, 3]);
    });

    test('filters by collection name', () => {
        const actual = filterCollections(collections, 'mountain');

        expect(actual.map((collection) => collection.id)).toEqual([1]);
    });

    test('filters by institution name', () => {
        const actual = filterCollections(collections, 'urban museum');

        expect(actual.map((collection) => collection.id)).toEqual([2]);
    });

    test('filters by notes', () => {
        const actual = filterCollections(collections, 'migration');

        expect(actual.map((collection) => collection.id)).toEqual([2]);
    });

    test('matches query case-insensitively', () => {
        const actual = filterCollections(collections, 'ALPINE');

        expect(actual.map((collection) => collection.id)).toEqual([1]);
    });

    test('returns empty array when there is no match', () => {
        const actual = filterCollections(collections, 'desert');

        expect(actual).toEqual([]);
    });

    test('handles missing optional fields without throwing', () => {
        const actual = filterCollections(collections, 'river');

        expect(actual.map((collection) => collection.id)).toEqual([3]);
    });
});
