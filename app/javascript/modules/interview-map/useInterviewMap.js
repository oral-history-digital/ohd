import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';
import { useMapReferenceTypes, referenceTypesToColorMap, transformIntoMarkers } from 'modules/map';
import mergeLocations from './mergeLocations';

export default function useInterviewMap(archiveId) {
    const pathBase = usePathBase();

    const { referenceTypes, error: referenceTypesError } = useMapReferenceTypes();

    const path = `${pathBase}/locations?archive_id=${archiveId}`;
    const { data: locations, error: locationsError } = useSWRImmutable(path, fetcher);

    let markers = [];
    if (referenceTypes && locations) {
        const colorMap = referenceTypesToColorMap(referenceTypes);

        const transformData = flow(
            mergeLocations,
            curry(transformIntoMarkers)(colorMap)
        );
        markers = transformData(locations);
    }

    return { isLoading: !(referenceTypes && locations), markers, error: locationsError };
}
