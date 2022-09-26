import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useCatalogStats() {
    const pathBase = usePathBase();
    const path = `${pathBase}/catalog/stats`;

    return useSWRImmutable(path, fetcher);
}
