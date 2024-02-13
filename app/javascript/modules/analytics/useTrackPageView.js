import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';

const TRACKING_DELAY = 25;

export default function useTrackPageView(title) {
    const currentUser = useSelector(getCurrentUser);
    const { trackPageView } = useMatomo();

    let options = title ? { documentTitle: title } : {};

    useEffect(() => {
        if (shouldTrack()) {
            setTimeout(() => {
                // Use setTimeout to wait for the document title to get updated.
                trackPageView(options);
            }, TRACKING_DELAY);
        }
    }, []);

    function shouldTrack() {
        return currentUser && !currentUser.do_not_track;
    }
}
