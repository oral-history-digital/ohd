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
    locale: 'en',
    project: { id: 1, shortname: 'test' },
    projectId: 'test',
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
        [
            {
                locale: 'en',
                project: { id: 1, shortname: 'test' },
                projectId: 'test',
            },
            'roles',
            null,
            null,
            'name=history&page=1',
        ],
        [
            {
                locale: 'en',
                project: { id: 1, shortname: 'test' },
                projectId: 'test',
            },
            'languages',
            null,
            null,
            'all',
        ],
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
        {
            locale: 'en',
            project: { id: 1, shortname: 'test' },
            projectId: 'test',
        },
        'roles',
        null,
        null,
        'name=history&page=1'
    );
});
