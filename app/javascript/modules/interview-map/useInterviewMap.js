import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';
import { referenceTypesToColorMap, transformIntoMarkers } from 'modules/map';
import mergeLocations from './mergeLocations';

export default function useInterviewMap(archiveId) {
    const pathBase = usePathBase();
    const typesUrl = `${pathBase}/searches/map_reference_types`;
    const { data: types, error: typesError } = useSWRImmutable(typesUrl, fetcher);
    const locationsUrl = `${pathBase}/locations.json?archive_id=${archiveId}`;
    const { data: locations, error: locationsError } = useSWRImmutable(locationsUrl, fetcher);

    let markers = [];
    if (types && locations) {
        const colorMap = referenceTypesToColorMap(types);

        const transformData = flow(
            mergeLocations,
            curry(transformIntoMarkers)(colorMap)
        );
        markers = transformData(locations);
    }

    return { isLoading: !(types && locations), markers, locationsError };
}
