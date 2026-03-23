import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetProjectCollections(projectId, options = {}) {
    const { page = 1, all = false, workflowState } = options;
    const pathBase = usePathBase();
    const queryParams = new URLSearchParams();
    if (all) {
        queryParams.set('all', 'true');
    } else {
        queryParams.set('page', String(page));
    }

    if (workflowState) {
        queryParams.set('workflow_state', workflowState);
    }

    const queryString = queryParams.toString();
    const path = projectId
        ? `${pathBase}/projects/${projectId}/collections${
              queryString ? `?${queryString}` : ''
          }`
        : null;

    const { data, error, isLoading, isValidating } = useSWRImmutable(
        path,
        fetcher
    );

    const collections = Array.isArray(data?.data) ? data.data : [];

    return {
        collections,
        page: data?.page,
        resultPagesCount: data?.result_pages_count,
        project: data?.project,
        loading: Boolean(path) && (isLoading || isValidating),
        error,
    };
}
