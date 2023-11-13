import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';

export default function useTrackPageView(title) {
    const currentUser = useSelector(getCurrentUser);
    const { trackPageView } = useMatomo();

    let options = title ? { documentTitle: title } : {};

    useEffect(() => {
        if (shouldTrack()) {
            console.log('Tracking page view')
            trackPageView(options);
        }
    }, []);

    function shouldTrack() {
        return currentUser && !currentUser.do_not_track;
    }
}
