import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';

/**
 * Returns trackPageView function that can be called by the client.
 */
export default function useTrackPageViewFunction() {
    const currentUser = useSelector(getCurrentUser);
    const { trackPageView: matomoTrackPageView } = useMatomo();

    function trackPageView() {
        if (shouldTrack()) {
            matomoTrackPageView({});
        }
    }

    function shouldTrack() {
        return currentUser && !currentUser.do_not_track;
    }

    return trackPageView;
}
