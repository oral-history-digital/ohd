import queryToText from './queryToText';

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

test('converts queries to readable titles', () => {
    const actual = queryToText(query, facets, 'de', {});
    const expected = 'fulltext: athen - gender: weiblich, männlich - typology: Flucht';

    expect(actual).toEqual(expected);
});

test('also works without facets being available', () => {
    const actual = queryToText(query, undefined, 'de', {});
    const expected = 'fulltext: athen - gender: female, male - typology: 646776';

    expect(actual).toEqual(expected);
});
