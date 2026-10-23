import { act, renderHook } from '@testing-library/react';

import usePaginatedAdminRecords from './usePaginatedAdminRecords';

const defaultProps = {
    query: { name: 'history', page: 1 },
    dataStatus: { all: 'fetched' },
    statuses: {},
    otherDataToLoad: [],
    resultPagesCount: 2,
    scope: 'role',
    fetchData: jest.fn(),
    setQueryParams: jest.fn(),
    pathBase: '/test/en',
    projectDbId: 1,
};

function renderPaginatedAdminRecords(props = {}) {
    return renderHook(() =>
        usePaginatedAdminRecords({ ...defaultProps, ...props })
    );
}

beforeEach(() => {
    jest.clearAllMocks();
});

test('fetches missing query results and supporting data on mount', () => {
    renderPaginatedAdminRecords({
        dataStatus: {},
        otherDataToLoad: ['language'],
    });

    expect(defaultProps.fetchData.mock.calls).toEqual([
        [{ pathBase: '/test/en' }, 'roles', null, null, 'name=history&page=1'],
        [{ pathBase: '/test/en' }, 'languages', null, null, 'all'],
    ]);
});

test('reports query loading and pagination state', () => {
    const { result } = renderPaginatedAdminRecords({
        dataStatus: { name_history_page_1: 'fetching' },
    });

    expect(result.current).toMatchObject({
        hasMorePages: true,
        isFetching: true,
        shouldShowPagination: true,
    });
});

test('requests the next page when the observer enters view', () => {
    const { result } = renderPaginatedAdminRecords({
        dataStatus: { name_history_page_1: 'fetched' },
    });

    act(() => result.current.loadNextPage(true));

    expect(defaultProps.setQueryParams).toHaveBeenCalledWith('roles', {
        page: 2,
    });
    expect(defaultProps.fetchData).toHaveBeenCalledWith(
        { pathBase: '/test/en' },
        'roles',
        null,
        null,
        'name=history&page=1'
    );
});

test('initial requests run once per route and use the new project context after navigation', () => {
    const props = {
        ...defaultProps,
        dataStatus: {},
        pathBase: '/test/en',
        projectDbId: 1,
    };
    const { rerender } = renderHook(
        (options) => usePaginatedAdminRecords(options),
        { initialProps: props }
    );
    expect(defaultProps.fetchData).toHaveBeenCalledTimes(1);
    rerender({ ...props });
    expect(defaultProps.fetchData).toHaveBeenCalledTimes(1);
    rerender({ ...props, pathBase: '/other/de', projectDbId: 2 });
    expect(defaultProps.fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/other/de' },
        'roles',
        null,
        null,
        'name=history&page=1'
    );
});
