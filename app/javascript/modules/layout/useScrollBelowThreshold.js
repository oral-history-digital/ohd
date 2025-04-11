import { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';

import { SITE_HEADER_HEIGHT_MOBILE, SITE_HEADER_HEIGHT_DESKTOP, MEDIA_PLAYER_HEIGHT_MOBILE,
    MEDIA_PLAYER_HEIGHT_DESKTOP, MEDIA_PLAYER_HEIGHT_STICKY } from 'modules/constants';
import { isMobile } from 'modules/user-agent';

export function useScrollBelowThreshold() {
    const [isBelow, setIsBelow] = useState(false);

    const handleScroll = (e) => {
        const scrollY = e.target.scrollingElement.scrollTop;

        const headerAndPlayerHeight = isMobile() ?
            SITE_HEADER_HEIGHT_MOBILE + MEDIA_PLAYER_HEIGHT_MOBILE :
            SITE_HEADER_HEIGHT_DESKTOP + MEDIA_PLAYER_HEIGHT_DESKTOP;

        const stickyThreshold = headerAndPlayerHeight - MEDIA_PLAYER_HEIGHT_STICKY;

        if (scrollY > stickyThreshold) {
            setIsBelow(true);
        } else {
            setIsBelow(false);
        }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);

    useEffect(() => {
        window.addEventListener('scroll', throttledHandleScroll);

        const cleanup = () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        }

        return cleanup;
    }, []);
    return isBelow;
}
