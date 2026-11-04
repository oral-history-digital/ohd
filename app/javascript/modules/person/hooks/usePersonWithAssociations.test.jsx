import { act, renderHook, waitFor } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { SWRConfig } from 'swr';

import usePersonWithAssociations from './usePersonWithAssociations';

jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/history/en',
}));
jest.mock('modules/data', () => ({ getCurrentUser: () => null }));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('modules/auth', () =>
    jest.requireActual('../../auth/projectAccessStatus-hook')
);

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

beforeEach(() => jest.resetAllMocks());

test('waits for project settings, propagates denial, and hides cached data while settings reload', async () => {
    useProject.mockReturnValue({ isLoading: true });
    fetcher.mockResolvedValue({ data: { id: 7, description: 'Private data' } });
    const { result, rerender } = renderHook(
        () => usePersonWithAssociations(7),
        { wrapper: Provider }
    );
    expect(useProject).toHaveBeenCalledWith();
    expect(result.current.isLoading).toBe(true);
    expect(fetcher).not.toHaveBeenCalled();

    const error = { status: 403, message: 'Access denied' };
    useProject.mockReturnValue({ isLoading: false, error });
    rerender();
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();

    useProject.mockReturnValue({
        project: { id: 12, grant_access_without_login: true },
    });
    rerender();
    await waitFor(() =>
        expect(result.current.data?.description).toBe('Private data')
    );
    expect(fetcher).toHaveBeenCalledWith(
        '/history/en/people/7.json?with_associations=true'
    );

    useProject.mockReturnValue({ isLoading: true });
    rerender();
    expect(result.current.data).toBeUndefined();
});

test('uses landing-page metadata after access revocation and ignores a late full response', async () => {
    let resolveFullRequest;
    fetcher.mockImplementation((path) =>
        path.includes('with_associations')
            ? new Promise((resolve) => {
                  resolveFullRequest = resolve;
              })
            : Promise.resolve({ data: { id: 7, use_pseudonym: true } })
    );
    useProject.mockReturnValue({
        project: { id: 12, grant_access_without_login: true },
    });
    const { result, rerender } = renderHook(
        () => usePersonWithAssociations(7),
        { wrapper: Provider }
    );
    await waitFor(() => expect(resolveFullRequest).toBeDefined());

    useProject.mockReturnValue({
        project: { id: 12, grant_access_without_login: false },
    });
    rerender();
    await waitFor(() => expect(result.current.data?.use_pseudonym).toBe(true));
    expect(fetcher).toHaveBeenCalledWith(
        '/history/en/people/7/landing_page_metadata.json'
    );
    await act(async () => {
        resolveFullRequest({ data: { id: 7, description: 'Private data' } });
    });
    expect(result.current.data).toEqual({ id: 7, use_pseudonym: true });
});
