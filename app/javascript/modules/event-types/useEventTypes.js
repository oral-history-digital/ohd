import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export default function useEventTypes() {
    const pathBase = usePathBase();

    const path = `${pathBase}/event_types.json`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return { isLoading, isValidating, data, error };
}
