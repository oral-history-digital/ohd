import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';

export default function useTrackPageView() {
    const currentUser = useSelector(getCurrentUser);
    const { trackPageView } = useMatomo();

    useEffect(() => {
        if (shouldTrackPageView()) {
            console.log('tracking page view')
            trackPageView();
        }
    }, []);

    function shouldTrackPageView() {
        if (currentUser && !currentUser.do_not_track) {
            return true;
        }

        return false;
    }
}
