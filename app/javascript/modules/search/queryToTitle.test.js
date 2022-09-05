import queryToTitle from './queryToTitle';

const query = {
    fulltext: 'athen',
    gender: [
        'female',
        'male',
    ],
    typology: [
        '646776',
    ],
    sort: 'title',
    order: 'desc',
};

const facets = {
    "gender": {
        "name": {
            "de": "Geschlecht",
        },
        "subfacets": {
            "female": {
                "name": {
                    "de": "weiblich",
                },
                "count": 25,
            },
            "male": {
                "name": {
                    "de": "männlich",
                },
                "count": 68,
            }
        }
    },
    "typology": {
        "id": 14,
        "type": "RegistryReferenceType",
        "translations": [
            {
                "registry_reference_type_id": 14,
                "locale": "de",
                "name": "Erfahrungen",
                "created_at": "2020-11-25T14:22:03.000+01:00",
                "updated_at": "2020-11-25T14:22:03.000+01:00"
            },
        ],
        "project_id": 1,
        "name": {
            "de": "Erfahrung",
        },
        "subfacets": {
            "646774": {
                "name": {
                    "de": "Widerstand",
                },
                "count": 45
            },
            "646775": {
                "name": {
                    "de": "Besatzungsalltag",
                },
                "count": 17
            },
            "646776": {
                "name": {
                    "de": "Flucht",
                },
            "count": 12
            },
            "646777": {
                "name": {
                    "de": "Konzentrationslager",
                },
            "count": 20
            },
            "646778": {
                "name": {
                    "de": "Judenverfolgung",
                },
            "count": 19
            },
            "646779": {
                "name": {
                    "de": "Vergeltungsaktionen und Massenhinrichtungen",
                },
            "count": 22
            },
            "646780": {
                "name": {
                    "de": "Kollaboration",
                },
            "count": 1
            }
        }
    },
};

const translations = {
    de: {
        modules: {
            workbook: {
                default_titles: {
                    search_for_term: 'Suche nach "%{searchTerm}"',
                    search_for_term_and_filters: 'Suche nach "%{searchTerm}", %{numFilters} Filter',
                    filter: 'Filter',
                    and_filters_more: 'und %{numFilters} weitere',
                },
            },
        },
    },
};

test('converts queries to readable titles', () => {
    const actual = queryToTitle(query, facets, 'de', translations);
    const expected = 'Suche nach "athen", 3 Filter';

    expect(actual).toEqual(expected);
});

test('produces title for fulltext only queries', () => {
    const actual = queryToTitle({ fulltext: 'athen' }, facets, 'de', translations);
    const expected = 'Suche nach "athen"';

    expect(actual).toEqual(expected);
});

test('produces title for 3 filters', () => {
    const clonedQuery = {...query};
    delete clonedQuery.fulltext;
    const actual = queryToTitle(clonedQuery, facets, 'de', translations);
    const expected = 'Filter weiblich, männlich und 1 weitere';

    expect(actual).toEqual(expected);
});

test('produces title for 2 filters', () => {
    const query = {
        gender: ['male'],
        typology: ['646776'],
    };
    const actual = queryToTitle(query, facets, 'de', translations);
    const expected = 'Filter männlich, Flucht';

    expect(actual).toEqual(expected);
});

test('produces title for 1 filter', () => {
    const query = { gender: ['male'] };
    const actual = queryToTitle(query, facets, 'de', translations);
    const expected = 'Filter männlich';

    expect(actual).toEqual(expected);
});

test('also works without facets being available', () => {
    const query = {
        gender: ['male'],
        typology: ['646776'],
    };
    const actual = queryToTitle(query, undefined, 'de', translations);
    const expected = 'Filter male, 646776';

    expect(actual).toEqual(expected);
});
