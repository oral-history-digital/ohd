import {
    formatCollectionCitation,
    formatProjectCitation,
} from './formatCitation';

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
