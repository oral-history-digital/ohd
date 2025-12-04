import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export default function useCatalogStats() {
    const pathBase = usePathBase();
    const path = `${pathBase}/catalog/stats`;

    return useSWRImmutable(path, fetcher);
}
