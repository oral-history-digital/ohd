import { renderHook } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';

import useRootEntry from './useRootEntry';

const mockDispatch = jest.fn();
let mockEntries;
let mockStatuses;
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH_ROOT' })),
    getRegistryEntries: () => mockEntries,
    getRegistryEntriesStatus: () => mockStatuses,
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: jest.fn(),
}));
jest.mock('react-redux', () => ({
    useSelector: (selector) => selector(),
    useDispatch: () => mockDispatch,
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockEntries = { 1: { id: 1 }, 2: { id: 2 } };
    mockStatuses = {};
    useProject.mockReturnValue({
        project: { root_registry_entry_id: 1 },
        isLoading: false,
    });
    usePathBase.mockReturnValue('/en');
});

test('waits for project settings and hides cached entries after denial or a missing root', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(useRootEntry);
    expect(useProject).toHaveBeenCalledWith({
        include: ['registry_configuration'],
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(mockDispatch).not.toHaveBeenCalled();

    const error = { status: 403, message: 'Access denied' };
    useProject.mockReturnValue({ error, isLoading: false });
    rerender();
    expect(result.current).toEqual({
        isLoading: false,
        data: undefined,
        error,
    });
    useProject.mockReturnValue({
        project: { root_registry_entry_id: null },
        isLoading: false,
    });
    rerender();
    expect(result.current).toEqual({
        isLoading: false,
        data: undefined,
        error: null,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
});

test('uses route-based loads and respects fetching, fetched, and reload statuses', () => {
    const { result, rerender } = renderHook(useRootEntry);
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        1,
        null,
        'with_associations=true'
    );
    expect(result.current.isLoading).toBe(true);
    mockStatuses = { 1: 'fetching' };
    rerender();
    expect(fetchData).toHaveBeenCalledTimes(1);
    mockStatuses = { 1: 'fetched-123' };
    rerender();
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe(mockEntries[1]);
    expect(result.current.isLoading).toBe(false);

    mockStatuses = { 1: 'reload-456' };
    rerender();
    expect(fetchData).toHaveBeenCalledTimes(2);
});

test('loads the next project root when the route changes without using the previous entry', () => {
    mockStatuses = { 1: 'fetched-123' };
    const { result, rerender } = renderHook(useRootEntry);
    expect(result.current.data.id).toBe(1);
    useProject.mockReturnValue({
        project: { root_registry_entry_id: 2 },
        isLoading: false,
    });
    usePathBase.mockReturnValue('/other/de');
    rerender();
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/other/de' },
        'registry_entries',
        2,
        null,
        'with_associations=true'
    );
    expect(result.current.data.id).toBe(2);
});
