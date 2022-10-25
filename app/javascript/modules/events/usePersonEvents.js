import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function usePersonEvents(personId) {
    const pathBase = usePathBase();

    const path = `${pathBase}/people/${personId}/events.json`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isLoading, isValidating, data, error };
}
