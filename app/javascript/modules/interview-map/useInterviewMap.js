import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';

import { usePathBase } from 'modules/routes';
import mergeLocations from './mergeLocations';
import transformIntoMarkers from './transformIntoMarkers';

const fetcher = url => fetch(url).then(res => res.json());

export default function useInterviewMap(archiveId) {
    const pathBase = usePathBase();
    const url = `${pathBase}/locations.json?archive_id=${archiveId}`;
    const { isValidating, data, error } = useSWRImmutable(url, fetcher);

    const transformData = flow(
        mergeLocations,
        transformIntoMarkers
    );
    const markers = transformData(data || []);

    return { isLoading: isValidating, markers, error };
}
