import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';

export default function useMapReferenceTypes() {
    const pathBase = usePathBase();
    const url = `${pathBase}/searches/map_reference_types`;
    const { isValidating, data, error } = useSWRImmutable(url, fetcher);

    return {
        isLoading: isValidating,
        mapReferenceTypes: data,
        error,
    };
}
