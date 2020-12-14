import * as selectors from './searchSelectors';

const state = {
    search: {
        archive: {
            facets: {
                gender: {},
            },
            query: {
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

        },
        interviews: {

        },
        registryEntries: {

        },
        user_registrations: {

        },
        roles: {

        },
        task_types: {

        },
        permissions: {

        },
        people: {

        },
        registry_reference_types: {

        },
        registry_name_types: {

        },
        projects: {

        },
        collections: {

        },
        languages: {

        },
    },
};

test('getArchiveFacets retrieves archive facets object', () => {
    expect(selectors.getArchiveFacets(state)).toEqual(state.search.archive.facets);
});

test('getArchiveQuery retrieves archive query object', () => {
    expect(selectors.getArchiveQuery(state)).toEqual(state.search.archive.query);
});

test('getArchiveFoundInterviews retrieves archive found interviews array', () => {
    expect(selectors.getArchiveFoundInterviews(state)).toEqual(state.search.archive.foundInterviews);
});

test('getArchiveResultPagesCount retrieves number of archive result pages', () => {
    expect(selectors.getArchiveResultPagesCount(state)).toEqual(state.search.archive.resultPagesCount);
});

test('getArchiveResultsCount retrieves number of archive results', () => {
    expect(selectors.getArchiveResultsCount(state)).toEqual(state.search.archive.resultsCount);
});
