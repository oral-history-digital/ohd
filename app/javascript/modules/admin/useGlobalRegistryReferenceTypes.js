import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useGlobalRegistryReferenceTypes() {
    const pathBase = usePathBase();
    const path = `${pathBase}/registry_reference_types/global.json`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isLoading, isValidating, data, error };
}
