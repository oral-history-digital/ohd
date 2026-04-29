import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetInstitution(id, options = {}) {
    const { lite = true } = options;
    const pathBase = usePathBase();

    const queryParams = new URLSearchParams();
    if (lite) {
        queryParams.set('lite', '1');
    }

    const queryString = queryParams.toString();
    const path = id
        ? `${pathBase}/institutions/${id}.json${
              queryString ? `?${queryString}` : ''
          }`
        : null;

    const { isValidating, isLoading, data, error, mutate } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        institution: data?.data,
        error,
        isValidating,
        isLoading,
        mutate,
    };
}

export default useGetInstitution;
