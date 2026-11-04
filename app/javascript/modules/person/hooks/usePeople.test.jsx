import { renderHook } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { usePathBase, useProject } from 'modules/routes';
import { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';

import useMutatePeople from './useMutatePeople';
import usePeople from './usePeople';

jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/routes', () => ({
    usePathBase: jest.fn(),
    useProject: jest.fn(),
}));
jest.mock('swr/immutable', () => jest.fn());
jest.mock('swr', () => ({ useSWRConfig: jest.fn() }));

const people = { 5: { id: 5 } };
const mutate = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { id: 7 } });
    usePathBase.mockReturnValue('/pilot/en');
    useSWRImmutable.mockReturnValue({ data: { data: people } });
    useSWRConfig.mockReturnValue({ mutate });
});

test.each(['/pilot/en', '/de'])(
    'shares the same people-cache key for reads and mutations through %s',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const { result } = renderHook(() => ({
            people: usePeople(),
            mutate: useMutatePeople(),
        }));
        const key = `${pathBase}/people.json?for_projects=7`;
        expect(useProject).toHaveBeenCalledWith({});
        expect(useSWRImmutable).toHaveBeenCalledWith(key, fetcher);
        expect(result.current.people.data).toEqual(people);
        result.current.mutate();
        expect(mutate).toHaveBeenLastCalledWith(key);
        const updater = jest.fn();
        result.current.mutate(updater);
        expect(mutate).toHaveBeenLastCalledWith(key, updater, {
            revalidate: false,
        });
    }
);

test('waits for project details, masks retained people on denial, and skips unavailable cache updates', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => ({
        people: usePeople(),
        mutate: useMutatePeople(),
    }));
    expect(useSWRImmutable).toHaveBeenLastCalledWith(null, fetcher);
    expect(result.current.people).toMatchObject({
        isLoading: true,
        data: undefined,
    });
    result.current.mutate();
    expect(mutate).not.toHaveBeenCalled();
    useProject.mockReturnValue({ project: { id: 7 } });
    rerender();
    expect(result.current.people.data).toEqual(people);
    const error = { message: 'Access denied' };
    useProject.mockReturnValue({ project: { id: 7 }, error });
    rerender();
    expect(result.current.people).toMatchObject({ error, data: undefined });
    result.current.mutate(jest.fn());
    expect(mutate).not.toHaveBeenCalled();
});

test('changes the list key and mutation target when project and locale change', () => {
    const { result, rerender } = renderHook(() => ({
        people: usePeople(),
        mutate: useMutatePeople(),
    }));
    useProject.mockReturnValue({ project: { id: 8 } });
    usePathBase.mockReturnValue('/other/de');
    rerender();
    expect(useSWRImmutable).toHaveBeenLastCalledWith(
        '/other/de/people.json?for_projects=8',
        fetcher
    );
    result.current.mutate();
    expect(mutate).toHaveBeenCalledWith('/other/de/people.json?for_projects=8');
});
