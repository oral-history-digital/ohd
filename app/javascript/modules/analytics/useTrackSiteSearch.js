import { useMatomo } from '@jonkoops/matomo-tracker-react';

import useShouldTrack from './useShouldTrack';

export default function useTrackSiteSearch() {
    const shouldTrack = useShouldTrack();
    const { trackSiteSearch } = useMatomo();

    function searchFunction(searchTerm) {
        if (shouldTrack) {
            trackSiteSearch({ keyword: searchTerm });
        }
    }

    return searchFunction;
}
