import { useEffect, useState } from 'react';
import debounce from 'debounce';

import { SITE_HEADER_HEIGHT, MEDIA_PLAYER_HEIGHT_STATIC, MEDIA_PLAYER_HEIGHT_STICKY } from 'modules/constants';

// TODO: Make the threshold fit for mobile, too.
const STICKY_THRESHOLD = SITE_HEADER_HEIGHT + MEDIA_PLAYER_HEIGHT_STATIC - MEDIA_PLAYER_HEIGHT_STICKY

export function useScrollBelowThreshold() {
    const [isBelow, setIsBelow] = useState(false);

    const handleScroll = (e) => {
        const scrollY = e.target.scrollingElement.scrollTop;

        if (scrollY > STICKY_THRESHOLD) {
            setIsBelow(true);
        } else {
            setIsBelow(false);
        }
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    useEffect(() => {
        window.addEventListener('scroll', debouncedHandleScroll);

        const cleanup = () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
        }

        return cleanup;
    }, []);

    return isBelow;
}
