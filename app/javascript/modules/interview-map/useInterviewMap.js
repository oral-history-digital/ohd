import { fetcher } from 'modules/api';
import {
    referenceTypesToColorMap,
    transformIntoMarkers,
    useMapReferenceTypes,
} from 'modules/map';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

import getBounds from './getBounds';

export default function useInterviewMap(archiveId) {
    const pathBase = usePathBase();

    const { referenceTypes, error: referenceTypesError } =
        useMapReferenceTypes();

    const path = `${pathBase}/locations?archive_id=${archiveId}`;
    const { data: locations, error: locationsError } = useSWRImmutable(
        path,
        fetcher
    );

    let markers = [];
    let bounds = null;
    if (referenceTypes && locations && !locationsError) {
        const colorMap = referenceTypesToColorMap(referenceTypes);

        markers = transformIntoMarkers(colorMap, locations);

        bounds = getBounds(locations);
    }

    return {
        isLoading: !(referenceTypes && locations),
        markers,
        bounds,
        error: locationsError,
        isEmpty: markers?.length === 0,
    };
}
