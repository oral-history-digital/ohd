import { renderHook } from '@testing-library/react';
import { fetcher } from 'modules/api';
import useSWRImmutable from 'swr/immutable';

import useInterviewContributors from './useInterviewContributors';

jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: 'en' }) }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/current/en' }));
jest.mock('swr/immutable', () => jest.fn(() => ({})));

beforeEach(() => jest.clearAllMocks());

test.each([
    [undefined, '/current/en'],
    [{ shortname: 'target' }, '/target/en'],
    [
        { shortname: 'target', archive_domain: 'https://target.example.org' },
        '/target/en',
    ],
])(
    'uses the current route or an explicit project prefix for %j',
    (project, pathBase) => {
        renderHook(() => useInterviewContributors(12, project));
        expect(useSWRImmutable).toHaveBeenCalledWith(
            `${pathBase}/people.json?contributors_for_interview=12`,
            fetcher
        );
    }
);

test('waits for the internal interview ID before requesting contributors', () => {
    renderHook(() =>
        useInterviewContributors(undefined, { shortname: 'target' })
    );
    expect(useSWRImmutable).toHaveBeenCalledWith(null, fetcher);
});

test('hides cached names when the contributor request is denied', () => {
    const error = { status: 403 };
    useSWRImmutable.mockReturnValueOnce({
        data: { data: { 5: { display_name: 'Retained name' } } },
        error,
    });
    const { result } = renderHook(() =>
        useInterviewContributors(12, { shortname: 'target' })
    );
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(error);
});
