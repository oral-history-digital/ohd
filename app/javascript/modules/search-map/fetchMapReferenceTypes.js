import { fetcher } from 'modules/api';

export default function fetchMapReferenceTypes(pathBase) {
    const url = `${pathBase}/searches/map_reference_types`;
    return fetcher(url);
}
