import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetCollection(id) {
    const pathBase = usePathBase();
    const path = id ? `${pathBase}/collections/${id}.json?lite=1` : null;
    const { isValidating, isLoading, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        collection: data?.data,
        error,
        isValidating,
        isLoading,
    };
}

export default useGetCollection;
