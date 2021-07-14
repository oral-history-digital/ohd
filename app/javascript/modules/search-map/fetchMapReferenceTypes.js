import { fetcher } from 'modules/api';

export function mapReferenceTypesKey() {
    return 'map-reference-types';
}

export default function fetchMapReferenceTypes(pathBase) {
    const url = `${pathBase}/searches/map_reference_types`;
    return fetcher(url);
}
