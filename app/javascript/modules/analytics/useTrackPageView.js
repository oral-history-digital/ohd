import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';

export default function useTrackPageView() {
    const currentUser = useSelector(getCurrentUser);
    const { trackPageView } = useMatomo();

    useEffect(() => {
        // What does this do if matomo provider is not configured?
        if (shouldTrackPageView()) {
            console.log('tracking page view')
            trackPageView();
        }
    }, []);

    function shouldTrackPageView() {
        if (currentUser) {
            return true;
        }

        // Check if project should be tracked.
        return false;
    }
}
