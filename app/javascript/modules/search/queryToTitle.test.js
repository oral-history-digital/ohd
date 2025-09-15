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

const translations = {
    de: {
        modules: {
            workbook: {
                default_titles: {
                    search_for_term: 'Suche nach "%{searchTerm}"',
                    search_for_term_and_filters:
                        'Suche nach "%{searchTerm}", %{numFilters} Filter',
                    filter: 'Filter',
                    and_filters_more: 'und %{numFilters} weitere',
                },
            },
        },
    },
};

/**
 * makeT - small test helper returning a `t(key, opts)` function compatible
 * with the project's i18n API.
 *
 * @param {string} loc - Locale code to read translations from (e.g. 'de').
 * @returns {(key: string, opts?: Object) => string} A `t` function that looks
 * up keys in the `translations` fixture and performs simple interpolation
 * for placeholders of the form "%{name}".
 *
 * Use this in unit tests to pass a lightweight `t` implementation to pure
 * utilities that expect `{ t, locale }`. This avoids mocking the full
 * i18n module when testing isolated logic.
 */
function makeT(loc) {
    return (key, opts) => {
        const parts = key.split('.');
        let node = translations[loc];
        for (let part of parts) {
            if (!node) break;
            node = node[part];
        }
        if (!node) {
            const partsForFallback = parts.slice();
            const last = partsForFallback.pop();
            let parent = translations[loc];
            for (let part of partsForFallback) {
                if (!parent) break;
                parent = parent[part];
            }
            if (
                parent &&
                parent['default_titles'] &&
                parent['default_titles'][last]
            ) {
                node = parent['default_titles'][last];
            }
        }
        let value = node || key;
        if (opts) {
            Object.keys(opts).forEach((k) => {
                value = value.replace(new RegExp('%{' + k + '}', 'g'), opts[k]);
            });
        }
        return value;
    };
}

test('converts queries to readable titles', () => {
    const actual = queryToTitle(query, facets, {
        t: makeT('de'),
        locale: 'de',
    });
    const expected = 'Suche nach "athen", 3 Filter';

    expect(actual).toEqual(expected);
});

test('produces title for fulltext only queries', () => {
    const actual = queryToTitle({ fulltext: 'athen' }, facets, {
        t: makeT('de'),
        locale: 'de',
    });
    const expected = 'Suche nach "athen"';

    expect(actual).toEqual(expected);
});

test('produces title for 3 filters', () => {
    const clonedQuery = { ...query };
    delete clonedQuery.fulltext;
    const actual = queryToTitle(clonedQuery, facets, {
        t: makeT('de'),
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
        t: makeT('de'),
        locale: 'de',
    });
    const expected = 'Filter männlich, Flucht';

    expect(actual).toEqual(expected);
});

test('produces title for 1 filter', () => {
    const query = { gender: ['male'] };
    const actual = queryToTitle(query, facets, {
        t: makeT('de'),
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
        t: makeT('de'),
        locale: 'de',
    });
    const expected = 'Filter male, 646776';

    expect(actual).toEqual(expected);
});
