import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { MARKER_COLOR_SEGMENT_TYPE } from '../constants';

export default function useMapReferenceTypes() {
    const pathBase = usePathBase();

    const path = `${pathBase}/searches/map_reference_types`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    // TODO: Another place?
    let combinedTypes;

    if (data) {
        combinedTypes = data.concat({
            id: 'S',
            name: 'Erwähnungen',
            color: MARKER_COLOR_SEGMENT_TYPE,
        })
    }

    return { isValidating, referenceTypes: combinedTypes, error };
}
