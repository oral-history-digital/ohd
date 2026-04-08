import getXmlLinks, {
    getCollectionXmlLinks,
    getProjectXmlLinks,
} from './getXmlLinks';

describe('getProjectXmlLinks', () => {
    test('builds Datacite and Dublin Core links for project', () => {
        const links = getProjectXmlLinks({
            locale: 'de',
            projectShortname: 'za',
        });

        expect(links).toEqual([
            {
                text: 'Datacite',
                metadataPrefix: 'oai_datacite',
                href: '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:za',
            },
            {
                text: 'Dublin Core',
                metadataPrefix: 'oai_dc',
                href: '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:oral-history.digital:za',
            },
        ]);
    });

    test('returns empty array when project shortname is missing', () => {
        expect(getProjectXmlLinks({ locale: 'de' })).toEqual([]);
    });
});

describe('getCollectionXmlLinks', () => {
    test('builds Datacite and Dublin Core links for collection', () => {
        const links = getCollectionXmlLinks({
            locale: 'de',
            collectionId: 90408825,
        });

        expect(links).toEqual([
            {
                text: 'Datacite',
                metadataPrefix: 'oai_datacite',
                href: '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:collection-90408825',
            },
            {
                text: 'Dublin Core',
                metadataPrefix: 'oai_dc',
                href: '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:oral-history.digital:collection-90408825',
            },
        ]);
    });

    test('returns empty array when collection id is missing', () => {
        expect(getCollectionXmlLinks({ locale: 'de' })).toEqual([]);
    });
});

describe('getXmlLinks', () => {
    test('delegates to project link builder', () => {
        const links = getXmlLinks({
            type: 'project',
            locale: 'de',
            projectShortname: 'za',
        });

        expect(links[0].href).toBe(
            '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:za'
        );
    });

    test('delegates to collection link builder', () => {
        const links = getXmlLinks({
            type: 'collection',
            locale: 'de',
            collectionId: 90408825,
        });

        expect(links[0].href).toBe(
            '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:collection-90408825'
        );
    });

    test('supports configurable instance identifier', () => {
        const links = getXmlLinks({
            type: 'project',
            locale: 'de',
            projectShortname: 'za',
            instanceIdentifier: 'example.org',
        });

        expect(links[0].href).toBe(
            '/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:example.org:za'
        );
    });

    test('returns empty array for unsupported type', () => {
        expect(getXmlLinks({ type: 'interview', locale: 'de' })).toEqual([]);
    });
});
