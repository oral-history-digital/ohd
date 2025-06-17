import throttle from 'lodash.throttle';
import { useEffect, useState } from 'react';

import { SITE_HEADER_HEIGHT_DESKTOP, SITE_HEADER_HEIGHT_MOBILE} from 'modules/constants';
import { isMobile } from 'modules/user-agent';

export function useScrollBelowThreshold() {
    const [isBelow, setIsBelow] = useState(false);

    const handleScroll = (e) => {
        const scrollY = e.target.scrollingElement.scrollTop;

        // Calculate header height
        const headerHeight = isMobile() ? 
            SITE_HEADER_HEIGHT_MOBILE : 
            SITE_HEADER_HEIGHT_DESKTOP;
        
        // Trigger after scrolling 1/3 of the header height
        const stickyThreshold = headerHeight / 3;

        if (scrollY > stickyThreshold) {
            setIsBelow(true);
        } else {
            setIsBelow(false);
        }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);

    useEffect(() => {
        window.addEventListener('scroll', throttledHandleScroll);
        
        // Initial check in case page is loaded already scrolled
        handleScroll({ target: { scrollingElement: document.documentElement } });

        const cleanup = () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        }

        return cleanup;
    }, [throttledHandleScroll]);
    
    return isBelow;
}
