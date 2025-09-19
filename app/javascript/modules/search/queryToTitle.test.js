import queryToTitle from './queryToTitle';

const query = {
    fulltext: 'athen',
    gender: ['female', 'male'],
    typology: ['646776'],
    sort: 'title',
    order: 'desc',
};

const facets = {
    gender: {
        name: {
            de: 'Geschlecht',
        },
        subfacets: {
            female: {
                name: {
                    de: 'weiblich',
                },
                count: 25,
            },
            male: {
                name: {
                    de: 'männlich',
                },
                count: 68,
            },
        },
    },
    typology: {
        id: 14,
        type: 'RegistryReferenceType',
        translations: [
            {
                registry_reference_type_id: 14,
                locale: 'de',
                name: 'Erfahrungen',
                created_at: '2020-11-25T14:22:03.000+01:00',
                updated_at: '2020-11-25T14:22:03.000+01:00',
            },
        ],
        project_id: 1,
        name: {
            de: 'Erfahrung',
        },
        subfacets: {
            646774: {
                name: {
                    de: 'Widerstand',
                },
                count: 45,
            },
            646775: {
                name: {
                    de: 'Besatzungsalltag',
                },
                count: 17,
            },
            646776: {
                name: {
                    de: 'Flucht',
                },
                count: 12,
            },
            646777: {
                name: {
                    de: 'Konzentrationslager',
                },
                count: 20,
            },
            646778: {
                name: {
                    de: 'Judenverfolgung',
                },
                count: 19,
            },
            646779: {
                name: {
                    de: 'Vergeltungsaktionen und Massenhinrichtungen',
                },
                count: 22,
            },
            646780: {
                name: {
                    de: 'Kollaboration',
                },
                count: 1,
            },
        },
    },
};

// Mock translation function
const mockT = jest.fn((key, params) => {
    const translations = {
        'modules.workbook.default_titles.search_for_term':
            'Suche nach "%{searchTerm}"',
        'modules.workbook.default_titles.search_for_term_and_filters':
            'Suche nach "%{searchTerm}", %{numFilters} Filter',
        'modules.workbook.filter': 'Filter',
        'modules.workbook.default_titles.and_filters_more':
            'und %{numFilters} weitere',
    };

    let text = translations[key] || key;

    if (params) {
        // Replace %{param} in the text with actual values from params
        Object.entries(params).forEach(([key, value]) => {
            text = text.replace(new RegExp(`%{${key}}`, 'g'), value);
        });
    }

    return text;
});

beforeEach(() => {
    mockT.mockClear();
});

test('converts queries to readable titles', () => {
    const actual = queryToTitle(query, facets, {
        t: mockT,
        locale: 'de',
    });
    const expected = 'Suche nach "athen", 3 Filter';

    expect(actual).toEqual(expected);
});

test('produces title for fulltext only queries', () => {
    const actual = queryToTitle({ fulltext: 'athen' }, facets, {
        t: mockT,
        locale: 'de',
    });
    const expected = 'Suche nach "athen"';

    expect(actual).toEqual(expected);
});

test('produces title for 3 filters', () => {
    const clonedQuery = { ...query };
    delete clonedQuery.fulltext;
    const actual = queryToTitle(clonedQuery, facets, {
        t: mockT,
        locale: 'de',
    });
    const expected = 'Filter weiblich, männlich und 1 weitere';

    expect(actual).toEqual(expected);
});

test('produces title for 2 filters', () => {
    const query = {
        gender: ['male'],
        typology: ['646776'],
    };
    const actual = queryToTitle(query, facets, {
        t: mockT,
        locale: 'de',
    });
    const expected = 'Filter männlich, Flucht';

    expect(actual).toEqual(expected);
});

test('produces title for 1 filter', () => {
    const query = { gender: ['male'] };
    const actual = queryToTitle(query, facets, {
        t: mockT,
        locale: 'de',
    });
    const expected = 'Filter männlich';

    expect(actual).toEqual(expected);
});

test('also works without facets being available', () => {
    const query = {
        gender: ['male'],
        typology: ['646776'],
    };
    const actual = queryToTitle(query, undefined, {
        t: mockT,
        locale: 'de',
    });
    const expected = 'Filter male, 646776';

    expect(actual).toEqual(expected);
});
