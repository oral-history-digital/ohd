import { renderHook } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';

import useRegistryEntries from './useRegistryEntries';

let mockEntries;
let mockStatuses;
let mockLoggedIn;
let mockCanEdit;
let mockLocale;
const mockDispatch = jest.fn();
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH_ENTRIES' })),
    getRegistryEntries: () => mockEntries,
    getRegistryEntriesStatus: () => mockStatuses,
}));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => mockCanEdit }),
}));
jest.mock('modules/user', () => ({ getIsLoggedIn: () => mockLoggedIn }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: mockLocale }) }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: jest.fn(),
}));
jest.mock('react-redux', () => ({
    useSelector: (selector) => selector(),
    useDispatch: () => mockDispatch,
}));

const root = {
    id: 1,
    associations_loaded: true,
    child_ids: { en: [3, 4, 2, 99], de: [3, 4, 2] },
};
const nested = { id: 10, associations_loaded: true, child_ids: { en: [5] } };
const project = {
    root_registry_entry_id: 1,
    hidden_registry_entry_ids: ['3'],
    logged_out_visible_registry_entry_ids: ['2'],
};

beforeEach(() => {
    jest.clearAllMocks();
    mockLoggedIn = false;
    mockCanEdit = false;
    mockLocale = 'en';
    mockEntries = {
        2: {
            id: 2,
            name: { en: 'Zulu', de: 'Alpha' },
            parent_registry_hierarchy_ids: { 1: true },
        },
        3: {
            id: 3,
            name: { en: 'Alpha', de: 'Beta' },
            parent_registry_hierarchy_ids: { 1: true },
        },
        4: {
            id: 4,
            name: { en: 'Beta', de: 'Zulu' },
            parent_registry_hierarchy_ids: { 1: true },
        },
        5: {
            id: 5,
            name: { en: 'Nested' },
            parent_registry_hierarchy_ids: { 10: true },
        },
    };
    mockStatuses = {
        children_for_entry_1: 'fetched-123',
        children_for_entry_10: 'fetched-123',
    };
    useProject.mockReturnValue({ project });
    usePathBase.mockReturnValue('/en');
});

test.each([
    ['visitor', false, false, root, [2]],
    ['logged-in user', true, false, root, [4, 2]],
    ['editor', false, true, root, [3, 4, 2]],
    ['visitor in a subtree', false, false, nested, [5]],
])(
    'preserves visibility and sorting for %s',
    (_, loggedIn, canEdit, parent, ids) => {
        mockLoggedIn = loggedIn;
        mockCanEdit = canEdit;
        const { result } = renderHook(() => useRegistryEntries(parent));
        expect(useProject).toHaveBeenCalledWith({
            include: ['registry_configuration'],
        });
        expect(result.current.dataLoaded).toBe(true);
        expect(result.current.registryEntries.map(({ id }) => id)).toEqual(ids);
        expect(mockDispatch).not.toHaveBeenCalled();
    }
);

test('hides cached children while project settings load or are denied', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => useRegistryEntries(root));
    expect(result.current).toEqual({
        dataLoaded: false,
        registryEntries: [],
        error: null,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    const error = { status: 403, message: 'Access denied' };
    useProject.mockReturnValue({ error });
    rerender();
    expect(result.current).toEqual({
        dataLoaded: false,
        registryEntries: [],
        error,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
});

test('loads parent associations before children and avoids repeating pending or completed requests', () => {
    mockStatuses = {};
    const incomplete = { ...root, associations_loaded: false };
    const { result, rerender } = renderHook(
        ({ parent }) => useRegistryEntries(parent),
        { initialProps: { parent: incomplete } }
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        1,
        null,
        'with_associations=true'
    );
    mockStatuses = { 1: 'fetching' };
    rerender({ parent: incomplete });
    expect(fetchData).toHaveBeenCalledTimes(1);
    mockStatuses = { 1: 'fetched-123' };
    rerender({ parent: root });
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        null,
        null,
        'children_for_entry=1'
    );
    mockStatuses = { 1: 'fetched-123', children_for_entry_1: 'fetching' };
    rerender({ parent: root });
    expect(result.current.dataLoaded).toBe(false);
    mockStatuses = { 1: 'fetched-123', children_for_entry_1: 'fetched-456' };
    rerender({ parent: root });
    expect(result.current.dataLoaded).toBe(true);
    expect(fetchData).toHaveBeenCalledTimes(2);
});

test('uses current-locale child IDs and names and handles an unavailable locale list', () => {
    mockLoggedIn = true;
    const { result, rerender } = renderHook(() => useRegistryEntries(root));
    expect(result.current.registryEntries.map(({ id }) => id)).toEqual([4, 2]);
    mockLocale = 'de';
    rerender();
    expect(result.current.registryEntries.map(({ id }) => id)).toEqual([2, 4]);
    mockLocale = 'fr';
    rerender();
    expect(result.current.registryEntries).toEqual([]);
});
