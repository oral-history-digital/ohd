import { renderHook } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { useProjectAccessStatus } from 'modules/auth';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

import useInterviewSearch from './useInterviewSearch';

jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/auth', () => ({ useProjectAccessStatus: jest.fn() }));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/interview-preview', () => ({
    searchResultCount: jest.requireActual(
        '../interview-preview/searchResultCount'
    ).default,
}));
jest.mock('swr/immutable', () => jest.fn());

const project = { id: 7, shortname: 'other' };
const data = {
    found_segments: [{ id: 1 }],
    found_headings: [],
    found_registry_entries: [],
    found_photos: [],
    found_biographical_entries: [],
    found_annotations: [],
    found_observations: [],
};

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/pilot/en');
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: true });
    useSWRImmutable.mockReturnValue({ data, isLoading: false });
});

test.each(['/pilot/en', '/de'])(
    'searches public interview IDs through %s using the supplied project access',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const { result } = renderHook(() =>
            useInterviewSearch('other001', 'Berlin', project)
        );
        expect(useProjectAccessStatus).toHaveBeenCalledWith(project);
        expect(useSWRImmutable).toHaveBeenCalledWith(
            `${pathBase}/searches/interview?fulltext=Berlin&id=other001`,
            fetcher,
            { keepPreviousData: false }
        );
        expect(result.current).toMatchObject({
            data,
            numResults: 1,
            segmentResults: [{ id: 1 }],
        });
    }
);

test('hides retained and late results after project access is revoked', () => {
    const { result, rerender } = renderHook(() =>
        useInterviewSearch('other001', 'Berlin', project)
    );
    expect(result.current.numResults).toBe(1);
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: false });
    rerender();
    expect(useSWRImmutable).toHaveBeenLastCalledWith(null, fetcher, {
        keepPreviousData: false,
    });
    expect(result.current).toMatchObject({
        data: undefined,
        numResults: 0,
        segmentResults: [],
    });
    useSWRImmutable.mockReturnValue({
        data: { ...data, found_segments: [{ id: 2 }] },
    });
    rerender();
    expect(result.current.data).toBeUndefined();
    expect(result.current.segmentResults).toEqual([]);
});

test.each([
    [undefined, 'Berlin'],
    [project, ''],
])(
    'skips fetching with project %p and term %s',
    (selectedProject, fulltext) => {
        const { result } = renderHook(() =>
            useInterviewSearch('other001', fulltext, selectedProject)
        );
        expect(useSWRImmutable).toHaveBeenLastCalledWith(null, fetcher, {
            keepPreviousData: false,
        });
        expect(result.current.data).toBeUndefined();
        expect(result.current.numResults).toBe(0);
    }
);

test('reports failed requests without displaying retained result data', () => {
    const error = { message: 'Search failed' };
    useSWRImmutable.mockReturnValue({ data, error });
    const { result } = renderHook(() =>
        useInterviewSearch('other001', 'Berlin', project)
    );
    expect(result.current.error).toBe(error);
    expect(result.current.segmentResults).toEqual([]);
});
