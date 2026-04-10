import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRMutation from 'swr/mutation';

function buildQueryString(params) {
    const queryParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v !== undefined && v !== null && v !== '') {
                    queryParams.append(`${key}[]`, String(v));
                }
            });
            return;
        }

        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });

    return queryParams.toString();
}

async function fetchArchiveIds(url, { arg: params }) {
    const queryString = buildQueryString(params);
    const body = await fetcher(`${url}?${queryString}`);
    return Array.isArray(body?.archive_ids) ? body.archive_ids : [];
}

export function useArchiveSearchIds() {
    const pathBase = usePathBase();
    const endpoint = `${pathBase}/searches/archive`;
    const { trigger, isMutating, error } = useSWRMutation(
        endpoint,
        fetchArchiveIds
    );

    async function fetchAllFilteredArchiveIds(allParams) {
        const params = {
            ...allParams,
            ids_only: true,
        };
        delete params.page;

        return trigger(params);
    }

    return {
        fetchAllFilteredArchiveIds,
        isLoading: isMutating,
        error,
    };
}

export default useArchiveSearchIds;
