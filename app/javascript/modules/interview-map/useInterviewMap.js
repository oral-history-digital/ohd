import { useQuery } from 'react-query';
import flow from 'lodash.flow';

import { usePathBase } from 'modules/routes';
import fetchInterviewMap from './fetchInterviewMap';
import mergeLocations from './mergeLocations';
import transformIntoMarkers from './transformIntoMarkers';

export default function useInterviewMap(archiveId) {
    const pathBase = usePathBase();

    const { isLoading, data, error } = useQuery(
        ['interview-map', archiveId],
        () => fetchInterviewMap(pathBase, archiveId),
        {
            staleTime: 10*60*1000,
            cacheTime: 60*60*1000,
        }
    );

    const transformData = flow(
        mergeLocations,
        transformIntoMarkers
    );
    const markers = transformData(data || []);

    return { isLoading, markers, error };
}
