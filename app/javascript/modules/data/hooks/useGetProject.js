import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetProject(projectId, options = {}) {
    const { lite = false } = options;
    const pathBase = usePathBase();

    const queryParams = new URLSearchParams();
    if (lite) {
        queryParams.set('lite', '1');
    }

    const queryString = queryParams.toString();
    const path = projectId
        ? `${pathBase}/projects/${projectId}.json${
              queryString ? `?${queryString}` : ''
          }`
        : null;

    const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        project: data?.data,
        loading: Boolean(path) && (isLoading || isValidating),
        error,
        mutate,
    };
}

export default useGetProject;
