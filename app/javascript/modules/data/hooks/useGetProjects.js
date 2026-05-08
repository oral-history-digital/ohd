import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetProjects(options = {}) {
    const {
        page = 1,
        all = false,
        workflowState,
        includeUmbrella = false,
    } = options;
    const pathBase = usePathBase();

    const queryParams = new URLSearchParams();
    queryParams.set(all ? 'all' : 'page', all ? 'true' : String(page));
    workflowState ? queryParams.set('workflow_state', workflowState) : null;
    includeUmbrella ? queryParams.set('include_umbrella', 'true') : null;

    const path = `${pathBase}/projects/list?${queryParams.toString()}`;

    const { isLoading, isValidating, data, error, mutate } = useSWRImmutable(
        path,
        fetcher
    );

    const projects = Array.isArray(data?.data) ? data.data : [];

    return {
        isLoading,
        isValidating,
        projects,
        page: data?.page,
        resultPagesCount: data?.result_pages_count,
        error,
        mutate,
    };
}

export default useGetProjects;
