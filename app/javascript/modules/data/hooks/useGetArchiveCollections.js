import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetArchiveCollections(archiveId) {
    const pathBase = usePathBase();
    const path = archiveId
        ? `${pathBase}/projects/${archiveId}/collections`
        : null;

    const { data, error, isLoading, isValidating } = useSWRImmutable(
        path,
        fetcher
    );

    const collections = Array.isArray(data?.data) ? data.data : [];

    return {
        collections,
        loading: Boolean(path) && (isLoading || isValidating),
        error,
    };
}
