import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react'

export default function useTrackPageView() {
    const { trackPageView } = useMatomo();

    useEffect(() => {
        // What does this do if matomo provider is not configured?
        if (shouldTrackPageView()) {
            trackPageView();
        }
    }, []);

    function shouldTrackPageView() {
        // Check if user is logged in and do_not_track is false.
        // Check if project should be tracked.
        return true;
    }
}
