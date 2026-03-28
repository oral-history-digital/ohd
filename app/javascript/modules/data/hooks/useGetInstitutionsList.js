import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetInstitutionsList(options = {}) {
    const { page = 1, all = false } = options;
    const pathBase = usePathBase();
    const queryParams = new URLSearchParams();
    if (all) {
        queryParams.set('all', 'true');
    } else {
        queryParams.set('page', String(page));
    }

    const path = `${pathBase}/institutions/list?${queryParams.toString()}`;

    const { data, error, isLoading, isValidating } = useSWRImmutable(
        path,
        fetcher
    );

    const institutions = Array.isArray(data?.data) ? data.data : [];

    return {
        institutions,
        page: data?.page,
        resultPagesCount: data?.result_pages_count,
        loading: Boolean(path) && (isLoading || isValidating),
        error,
    };
}
