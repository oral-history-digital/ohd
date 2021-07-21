import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useMapReferenceTypes() {
    const pathBase = usePathBase();

    const path = `${pathBase}/searches/map_reference_types`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isValidating, referenceTypes: data, error };
}
