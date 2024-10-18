import { useEffect } from 'react';

import { TRACKING_DELAY } from './constants';
import useTrackPageViewFunction from './useTrackPageViewFunction';

export default function useTrackPageView(title) {
    const trackPageView = useTrackPageViewFunction();

    useEffect(() => {
        trackPageView(title, TRACKING_DELAY);
    }, []);
}
