import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';

import { usePathBase } from 'modules/routes';
import fetcher from './fetcher';
import mergeLocations from './mergeLocations';
import transformIntoMarkers from './transformIntoMarkers';

export default function useInterviewMap(archiveId) {
    const pathBase = usePathBase();
    const typesUrl = `${pathBase}/searches/map_reference_types`;
    const { data: types, error: typesError } = useSWRImmutable(typesUrl, fetcher);
    const locationsUrl = `${pathBase}/locations.json?archive_id=${archiveId}`;
    const { data: locations, error: locationsError } = useSWRImmutable(locationsUrl, fetcher);

    let markers = [];
    if (types && locations) {
        const colorMap = new Map();
        types.forEach(type => {
            colorMap.set(type.id, type.color);
        });

        const curriedTransformIntoMarkers = locations => transformIntoMarkers(colorMap, locations);
        const transformData = flow(
            mergeLocations,
            curriedTransformIntoMarkers
        );
        markers = transformData(locations);
    }

    return { isLoading: !(types && locations), markers, locationsError };
}
