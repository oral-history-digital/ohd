import { act, renderHook, waitFor } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { useSearchParams } from 'modules/query-string';
import { usePathBase, useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { SWRConfig } from 'swr';

import useArchiveSearch from './useArchiveSearch';
import useFacets from './useFacets';

function Provider({ children }) {
    return (
        <SWRConfig
            value={{ provider: () => new Map(), shouldRetryOnError: false }}
        >
            {children}
        </SWRConfig>
    );
}
Provider.propTypes = { children: PropTypes.node };

let mockAccountState;
jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/query-string', () => ({ useSearchParams: jest.fn() }));
jest.mock('modules/routes', () => ({
    usePathBase: jest.fn(),
    useProject: jest.fn(),
}));
jest.mock('modules/user', () => ({
    getIsLoggedIn: (state) => state.isLoggedIn,
    getLoggedInAt: (state) => state.loggedInAt,
}));
jest.mock('react-redux', () => ({
    useSelector: (selector) => selector(mockAccountState),
}));

beforeEach(() => {
    jest.resetAllMocks();
    mockAccountState = { isLoggedIn: true, loggedInAt: 1 };
    usePathBase.mockReturnValue('/history/en');
    useProject.mockReturnValue({ project: { id: 12 } });
    useSearchParams.mockReturnValue({
        facets: {},
        yearOfBirthMin: NaN,
        yearOfBirthMax: NaN,
        interviewYearMin: NaN,
        interviewYearMax: NaN,
    });
});

test.each([
    ['facets', useFacets, (value) => value.facets],
    ['interviews', useArchiveSearch, (value) => value.interviews],
])(
    '%s discard privileged responses across logout and another login',
    async (_, hook, read) => {
        const hiddenCollection = { collection_id: 42 };
        const privileged = {
            facets: hiddenCollection,
            interviews: [hiddenCollection],
            results_count: 1,
        };
        fetcher.mockResolvedValue(privileged);
        const { result, rerender } = renderHook(hook, { wrapper: Provider });
        await waitFor(() => expect(read(result.current)).toBeDefined());
        expect(JSON.stringify(read(result.current))).toContain('42');

        let resolveRequest;
        fetcher.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                })
        );
        mockAccountState = { isLoggedIn: false, loggedInAt: false };
        rerender();
        expect(read(result.current)).toBeUndefined();
        await waitFor(() => expect(resolveRequest).toBeDefined());
        const publicResponse = {
            facets: {},
            interviews: [{ archive_id: 'H-1', collection_id: null }],
            results_count: 1,
        };
        await act(async () => {
            resolveRequest(publicResponse);
        });
        await waitFor(() => expect(read(result.current)).toBeDefined());
        expect(JSON.stringify(read(result.current))).not.toContain('42');

        resolveRequest = undefined;
        mockAccountState = { isLoggedIn: true, loggedInAt: 2 };
        rerender();
        expect(read(result.current)).toBeUndefined();
        await waitFor(() => expect(resolveRequest).toBeDefined());
        await act(async () => {
            resolveRequest(publicResponse);
        });
        await waitFor(() => expect(read(result.current)).toBeDefined());
        expect(JSON.stringify(read(result.current))).not.toContain('42');
    }
);

test('interview search waits for project settings, reports denial, and hides retained pages', async () => {
    fetcher.mockResolvedValue({
        interviews: [{ archive_id: 'H-1' }],
        results_count: 1,
    });
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(useArchiveSearch, {
        wrapper: Provider,
    });
    expect(useProject).toHaveBeenCalledWith({});
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(true);

    const error = { status: 403, message: 'Access denied' };
    useProject.mockReturnValue({ error, isLoading: false });
    rerender();
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();

    useProject.mockReturnValue({
        project: { default_search_order: 'archive_id' },
    });
    rerender();
    await waitFor(() => expect(result.current.total).toBe(1));
    const url = new URL(fetcher.mock.calls[0][0], 'https://example.org');
    expect(url.pathname).toBe('/history/en/searches/archive');
    expect(url.searchParams.get('sort')).toBe('archive_id');
    expect(url.searchParams.get('order')).toBe('asc');

    useProject.mockReturnValue({ isLoading: true });
    rerender();
    expect(result.current.interviews).toBeUndefined();
    expect(result.current.data).toBeUndefined();
    expect(result.current.total).toBeUndefined();
});

test('interview search preserves explicit sort, filters, and pagination', async () => {
    useProject.mockReturnValue({ project: { default_search_order: 'random' } });
    useSearchParams.mockReturnValue({
        sortBy: 'duration',
        sortOrder: 'desc',
        fulltext: 'history',
        facets: { collection_id: ['42'] },
        yearOfBirthMin: 1950,
        yearOfBirthMax: 1951,
        interviewYearMin: 2000,
        interviewYearMax: 2001,
    });
    fetcher.mockImplementation(async (path) => ({
        interviews: [
            {
                archive_id: `H-${new URL(path, 'https://example.org').searchParams.get('page')}`,
            },
        ],
        results_count: 2,
    }));
    const { result } = renderHook(useArchiveSearch, { wrapper: Provider });
    await waitFor(() => expect(result.current.interviews).toHaveLength(1));
    await act(async () => {
        await result.current.setSize(2);
    });
    await waitFor(() => expect(result.current.interviews).toHaveLength(2));
    expect(
        result.current.interviews.map(({ archive_id }) => archive_id)
    ).toEqual(['H-1', 'H-2']);
    const query = new URL(fetcher.mock.calls.at(-1)[0], 'https://example.org')
        .searchParams;
    expect(query.get('page')).toBe('2');
    expect(query.get('sort')).toBe('duration');
    expect(query.get('order')).toBe('desc');
    expect(query.get('fulltext')).toBe('history');
    expect(query.getAll('collection_id[]')).toEqual(['42']);
    expect(query.getAll('year_of_birth[]')).toEqual(['1950', '1951']);
    expect(query.getAll('interview_year[]')).toEqual(['2000', '2001']);
});
