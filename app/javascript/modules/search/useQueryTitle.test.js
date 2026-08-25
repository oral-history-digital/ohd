import { renderHook } from '@testing-library/react';
import { useI18n } from 'modules/i18n';

import useQueryTitle from './useQueryTitle';

// Mock the i18n module
jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(),
}));

// Helper function to get the hook result
function getHookResult(query, facets) {
    return renderHook(() => useQueryTitle(query, facets)).result.current;
}

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

beforeEach(() => {
    useI18n.mockReturnValue({
        t: jest.fn((key, params) => {
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
        }),
        locale: 'de',
    });
});

test('converts queries to readable titles', () => {
    const result = getHookResult(query, facets);
    const expected = 'Suche nach "athen", 3 Filter';

    expect(result).toEqual(expected);
});

test('produces title for fulltext only queries', () => {
    const result = getHookResult({ fulltext: 'athen' }, facets);
    const expected = 'Suche nach "athen"';

    expect(result).toEqual(expected);
});

test('produces title for 3 filters', () => {
    const clonedQuery = { ...query };
    delete clonedQuery.fulltext;
    const result = getHookResult(clonedQuery, facets);
    const expected = 'Filter weiblich, männlich und 1 weitere';

    expect(result).toEqual(expected);
});

test('produces title for 2 filters', () => {
    const query = {
        gender: ['male'],
        typology: ['646776'],
    };
    const result = getHookResult(query, facets);
    const expected = 'Filter männlich, Flucht';

    expect(result).toEqual(expected);
});

test('produces title for 1 filter', () => {
    const query = { gender: ['male'] };
    const result = getHookResult(query, facets);
    const expected = 'Filter männlich';

    expect(result).toEqual(expected);
});

test('also works without facets being available', () => {
    const query = {
        gender: ['male'],
        typology: ['646776'],
    };
    const result = getHookResult(query, undefined);
    const expected = 'Filter male, 646776';

    expect(result).toEqual(expected);
});
