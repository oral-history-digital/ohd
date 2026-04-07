import {
    formatCollectionCitation,
    formatProjectCitation,
} from './formatCitation';

describe('formatProjectCitation', () => {
    test('formats project citation with DOI', () => {
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

        expect(result).toBe(
            'Freie Universitat Berlin, Universitatsbibliothek der Freien Universitat Berlin: Interview-Archiv "Eiserner Vorhang", https://portal.oral-history.digital/de/catalog/archives/1368417, DOI: https://doi.org/10.17169/project.1368417'
        );
    });

    test('formats project citation without DOI', () => {
        const result = formatProjectCitation({
            institutions: [{ name: { en: 'FernUniversitat in Hagen' } }],
            projectName: { en: 'Interview Archive' },
            projectId: 42,
            locale: 'en',
            origin: 'https://portal.oral-history.digital',
        });

        expect(result).toBe(
            'FernUniversitat in Hagen: Interview Archive, https://portal.oral-history.digital/en/catalog/archives/42'
        );
    });
});

describe('formatCollectionCitation', () => {
    test('formats collection citation and preserves quotation marks', () => {
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
        });

        expect(result).toBe(
            'Institut fur Geschichte und Biographie der FernUniversitat in Hagen: Interview-Archiv "Archiv "Deutsches Gedachtnis"", Sammlung "Berliner Jugend", https://portal.oral-history.digital/de/catalog/collections/90408866, DOI: https://doi.org/10.17169/collection.90408866'
        );
    });
});
