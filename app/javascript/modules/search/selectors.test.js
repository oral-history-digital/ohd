import { NAME  } from './constants';
import * as selectors from './selectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
        locale: 'de',
    },
    data: {
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
                observations: {
                    de: 'Berlin Berlin Berlin',
                },
            },
        },
    },
    [NAME]: {
        archive: {
            facets: {
                gender: {
                    name: {
                        en: 'Gender',
                    },
                },
            },
            query: {
                fulltext: 'alice',
                page: 1,
            },
            foundInterviews: [
                {
                    id: 254,
                    type: 'Interview',
                },
            ],
            resultPagesCount: 50,
            resultsCount: 590,
        },
        map: {
            facets: {
                language_id: {
                    name: {
                        en: 'Language',
                    },
                },
            },
            query: {
                page: 1,
            },
        },
        interviews: {
            cd003: {
                fulltext: 'berlin',
                foundSegments: ['dummySegment'],
                foundHeadings: ['dummyHeading'],
                foundRegistryEntries: ['dummyRegistryEntry'],
                foundBiographicalEntries: ['dummyBiographicalEntry'],
                foundPhotos: [],
                foundAnnotations: ['dummyAnnotation'],
                foundObservations: ['dummy', 'dummy', 'dummy'],
            },
            za003: {
                fulltext: 'poland',
            },
        },
        registryEntries: {
            showRegistryEntriesTree: true,
            results: [],
        },
        user_registrations: {
            query: {
                'user_registration_projects.workflow_state': 'account_confirmed',
                page: 1,
            },
        },
        permissions: {
            query: {
                name: 'account',
                page: 2,
            },
        },
        projects: {
            1: {
                name: 'cdoh',
                roles: {
                    query: {
                        desc: 'interview',
                        page: 1,
                    },
                },
                task_types: {
                    query: {
                        label: 'protocol',
                        page: 1,
                    },
                },
                people: {
                    query: {
                        first_name: 'marina',
                        page: 2,
                    },
                },
                registry_reference_types: {
                    query: {
                        name: 'acquaintance',
                        page: 1,
                    },
                },
                registry_name_types: {

                },
                collections: {
                    query: {
                        name: 'israel',
                        page: 1,
                    },
                },
            },
        },
        languages: {
            query: {
                name: 'italian',
                page: 2,
            },
        },
        isMapSearching: true,
        isRegistryEntrySearching: true,
    },
};

test('getArchiveFacets retrieves archive facets object', () => {
    expect(selectors.getArchiveFacets(state)).toEqual(state[NAME].archive.facets);
});

test('getArchiveQuery retrieves archive query object', () => {
    expect(selectors.getArchiveQuery(state)).toEqual(state[NAME].archive.query);
});

test('getArchiveQueryFulltext retrieves archive query object fulltext part', () => {
    expect(selectors.getArchiveQueryFulltext(state)).toEqual(state[NAME].archive.query.fulltext);
});

test('getArchiveFoundInterviews retrieves archive found interviews array', () => {
    expect(selectors.getArchiveFoundInterviews(state)).toEqual(state[NAME].archive.foundInterviews);
});

test('getArchiveResultPagesCount retrieves number of archive result pages', () => {
    expect(selectors.getArchiveResultPagesCount(state)).toEqual(state[NAME].archive.resultPagesCount);
});

test('getArchiveResultsCount retrieves number of archive results', () => {
    expect(selectors.getArchiveResultsCount(state)).toEqual(state[NAME].archive.resultsCount);
});

test('getMapQuery retrieves map query object', () => {
    expect(selectors.getMapQuery(state)).toEqual(state[NAME].map.query);
});

test('getMapFacets retrieves map facets object', () => {
    expect(selectors.getMapFacets(state)).toEqual(state[NAME].map.facets);
});

test('getRegistryEntriesSearch retrieves registry entries part of search state', () => {
    expect(selectors.getRegistryEntriesSearch(state)).toEqual(state[NAME].registryEntries);
});

test('getShowRegistryEntriesTree get wether to show search results', () => {
    expect(selectors.getShowRegistryEntriesTree(state)).toEqual(state[NAME].registryEntries.showRegistryEntriesTree);
});

test('getIsRegistryEntrySearching retrieves registry entry search state', () => {
    expect(selectors.getIsRegistryEntrySearching(state)).toEqual(state[NAME].isRegistryEntrySearching);
});

test('getPeopleQuery retrieves people query params', () => {
    expect(selectors.getPeopleQuery(state)).toEqual(state[NAME].people.query);
});

test('getRegistryReferenceTypesQuery retrieves registry reference types query params', () => {
    expect(selectors.getRegistryReferenceTypesQuery(state)).toEqual(state[NAME].registry_reference_types.query);
});

test('getCollectionsQuery retrieves collections query params', () => {
    expect(selectors.getCollectionsQuery(state)).toEqual(state[NAME].collections.query);
});

test('getLanguagesQuery retrieves languages query params', () => {
    expect(selectors.getLanguagesQuery(state)).toEqual(state[NAME].languages.query);
});

test('getRolesQuery retrieves roles query params', () => {
    expect(selectors.getRolesQuery(state)).toEqual(state[NAME].roles.query);
});

test('getPermissionsQuery retrieves permissions query params', () => {
    expect(selectors.getPermissionsQuery(state)).toEqual(state[NAME].permissions.query);
});

test('getTaskTypesQuery retrieves task types query params', () => {
    expect(selectors.getTaskTypesQuery(state)).toEqual(state[NAME].task_types.query);
});

test('getUserRegistrationsQuery retrieves user registrations query params', () => {
    expect(selectors.getUserRegistrationsQuery(state)).toEqual(state[NAME].user_registrations.query);
});

test('getInterviewSearchResults retrieves interview search results', () => {
    expect(selectors.getInterviewSearchResults(state)).toEqual(state[NAME].interviews);
});

test('getCurrentInterviewSearchResults retrieves current interview search results', () => {
    expect(selectors.getCurrentInterviewSearchResults(state)).toEqual(state[NAME].interviews.cd003);
});

test('getSegmentResults retrieves current interview segment search results', () => {
    expect(selectors.getSegmentResults(state)).toEqual(state[NAME].interviews.cd003.foundSegments);
});

test('getHeadingResults retrieves current interview heading search results', () => {
    expect(selectors.getHeadingResults(state)).toEqual(state[NAME].interviews.cd003.foundHeadings);
});

test('getRegistryEntryResults retrieves current interview registry entry search results', () => {
    expect(selectors.getRegistryEntryResults(state)).toEqual(state[NAME].interviews.cd003.foundRegistryEntries);
});

test('getPhotoResults retrieves current interview photo search results', () => {
    expect(selectors.getPhotoResults(state)).toEqual(state[NAME].interviews.cd003.foundPhotos);
});

test('getBiographyResults retrieves current interview biography search results', () => {
    expect(selectors.getBiographyResults(state)).toEqual(state[NAME].interviews.cd003.foundBiographicalEntries);
});

test('getAnnotationResults retrieves current interview annotation search results', () => {
    expect(selectors.getAnnotationResults(state)).toEqual(state[NAME].interviews.cd003.foundAnnotations);
});

test('getObservationsResults retrieves current interview observations search results', () => {
    expect(selectors.getObservationsResults(state)).toEqual(state[NAME].interviews.cd003.foundObservations);
});
