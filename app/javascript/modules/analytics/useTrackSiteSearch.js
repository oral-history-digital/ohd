import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { getCurrentUser } from 'modules/data';
import { useSelector } from 'react-redux';

export default function useTrackSiteSearch() {
    const currentUser = useSelector(getCurrentUser);
    const { trackSiteSearch } = useMatomo();

    function searchFunction(searchTerm) {
        if (shouldTrack()) {
            trackSiteSearch({ keyword: searchTerm });
        }
    }

    function shouldTrack() {
        return currentUser && !currentUser.do_not_track;
    }

    return searchFunction;
}
