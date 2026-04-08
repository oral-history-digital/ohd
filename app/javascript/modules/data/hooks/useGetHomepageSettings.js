import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export function useGetHomepageSettings() {
    const pathBase = usePathBase();

    const path = `${pathBase}/homepage_settings.json`;
    const { data, error, isLoading, isValidating } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        data: data?.data,
        page: data?.page,
        loading: Boolean(path) && (isLoading || isValidating),
        error,
    };
}
