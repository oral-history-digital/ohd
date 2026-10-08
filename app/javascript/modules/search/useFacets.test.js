import { act, renderHook, waitFor } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { useSearchParams } from 'modules/query-string';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { SWRConfig } from 'swr';

import useArchiveSearch from './useArchiveSearch';
import useFacets from './useFacets';

let mockAccountState;
jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/query-string', () => ({ useSearchParams: jest.fn() }));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/data', () => ({ getCurrentProject: () => ({ id: 12 }) }));
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
        const cache = new Map();
        function Provider({ children }) {
            return (
                <SWRConfig
                    value={{ provider: () => cache, shouldRetryOnError: false }}
                >
                    {children}
                </SWRConfig>
            );
        }
        Provider.propTypes = { children: PropTypes.node };
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
