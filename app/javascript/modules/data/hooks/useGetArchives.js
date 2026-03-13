import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetArchives(options = {}) {
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

    const path = `${pathBase}/projects/archives?${queryParams.toString()}`;

    const { isLoading, isValidating, data, error, mutate } = useSWRImmutable(
        path,
        fetcher
    );

    const archives = Array.isArray(data?.data) ? data.data : [];

    return {
        isLoading,
        isValidating,
        archives,
        page: data?.page,
        resultPagesCount: data?.result_pages_count,
        error,
        mutate,
    };
}

export default useGetArchives;
