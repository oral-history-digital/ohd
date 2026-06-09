import {
    formatCollectionCitation,
    formatProjectCitation,
    institutionNames,
} from './formatCitation';

describe('institutionNames', () => {
    test('returns null when institutions is missing', () => {
        expect(institutionNames(null, 'de')).toBeNull();
        expect(institutionNames(undefined, 'de')).toBeNull();
    });

    test('returns institution name without parent', () => {
        const institution = {
            id: 1368419,
            name: 'Universitätsbibliothek der Freien Universität Berlin',
            parent: null,
        };

        expect(institutionNames(institution, 'de')).toBe(
            'Universitätsbibliothek der Freien Universität Berlin'
        );
    });

    test('returns parent and child name when parent exists', () => {
        const institution = {
            id: 1368419,
            name: 'Universitätsbibliothek der Freien Universität Berlin',
            parent: {
                id: 1,
                name: 'Freie Universität Berlin',
            },
        };

        expect(institutionNames(institution, 'de')).toBe(
            'Freie Universität Berlin, Universitätsbibliothek der Freien Universität Berlin'
        );
    });

    test('handles an array of institutions', () => {
        const institutions = [
            {
                id: 1,
                name: 'Child A',
                parent: {
                    id: 10,
                    name: 'Parent A',
                },
            },
            {
                id: 2,
                name: 'Child B',
                parent: null,
            },
        ];

        expect(institutionNames(institutions, 'en')).toBe(
            'Parent A, Child A, Child B'
        );
    });

    test('filters institutions without a localized name', () => {
        const institutions = [
            {
                id: 1,
                name: null,
                parent: {
                    id: 10,
                    name: 'Parent A',
                },
            },
            {
                id: 2,
                name: 'Child B',
                parent: null,
            },
        ];

        expect(institutionNames(institutions, 'en')).toBe('Child B');
    });

    test('returns null when no institution has a displayable name', () => {
        const institutions = [
            {
                id: 1,
                name: null,
                parent: {
                    id: 10,
                    name: 'Parent A',
                },
            },
            {
                id: 2,
                name: '',
                parent: null,
            },
        ];

        expect(institutionNames(institutions, 'en')).toBeNull();
    });

    test('uses localized institution and parent names', () => {
        const institution = {
            id: 1,
            name: {
                de: 'Kindinstitution',
                en: 'Child institution',
            },
            parent: {
                id: 10,
                name: {
                    de: 'Elterninstitution',
                    en: 'Parent institution',
                },
            },
        };

        expect(institutionNames(institution, 'de')).toBe(
            'Elterninstitution, Kindinstitution'
        );

        expect(institutionNames(institution, 'en')).toBe(
            'Parent institution, Child institution'
        );
    });
});

describe('formatProjectCitation', () => {
    test('formats project citation with DOI only (no catalog link)', () => {
        const result = formatProjectCitation({
            institutions: [
                { name: { de: 'Freie Universitat Berlin' } },
                {
                    name: {
                        de: 'Universitatsbibliothek der Freien Universitat Berlin',
                    },
                },
            ],
            projectName: { de: 'Interview-Archiv "Eiserner Vorhang"' },
            projectId: 1368417,
            locale: 'de',
            origin: 'https://portal.oral-history.digital',
            doiUrl: 'https://doi.org/10.17169/project.1368417',
        });

        expect(result).toMatchSnapshot();
    });

    test('formats project citation with catalog link (no DOI)', () => {
        const result = formatProjectCitation({
            institutions: [{ name: { en: 'FernUniversitat in Hagen' } }],
            projectName: { en: 'Interview Archive' },
            projectId: 42,
            locale: 'en',
            origin: 'https://portal.oral-history.digital',
        });

        expect(result).toMatchSnapshot();
    });
});

describe('formatCollectionCitation', () => {
    test('formats collection citation with DOI and preserves quotation marks', () => {
        const result = formatCollectionCitation({
            institutions: [
                {
                    name: {
                        de: 'Institut fur Geschichte und Biographie der FernUniversitat in Hagen',
                    },
                },
            ],
            projectName: {
                de: 'Interview-Archiv "Archiv "Deutsches Gedachtnis""',
            },
            collectionName: { de: 'Sammlung "Berliner Jugend"' },
            collectionId: 90408866,
            locale: 'de',
            origin: 'https://portal.oral-history.digital',
            doi: '10.17169/collection.90408866',
            t: jest.fn().mockReturnValue('Collection'),
        });

        expect(result).toMatchSnapshot();
    });

    test('formats collection citation with catalog link (no DOI) and preserves quotation marks', () => {
        const result = formatCollectionCitation({
            institutions: [
                {
                    name: {
                        de: 'Institut fur Geschichte und Biographie der FernUniversitat in Hagen',
                    },
                },
            ],
            projectName: {
                de: 'Interview-Archiv "Archiv "Deutsches Gedachtnis""',
            },
            collectionName: { de: 'Sammlung "Berliner Jugend"' },
            collectionId: 90408866,
            locale: 'de',
            origin: 'https://portal.oral-history.digital',
            t: jest.fn().mockReturnValue('Collection'),
        });

        expect(result).toMatchSnapshot();
    });
});
