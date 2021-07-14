import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useFetchMapReferenceTypes() {
    const pathBase = usePathBase();

    const key = 'map-reference-types';
    const url = `${pathBase}/searches/map_reference_types`;
    const fetch = () => fetcher(url);

    return [key, fetch];
}
