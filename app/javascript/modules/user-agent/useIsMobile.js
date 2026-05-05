import { useEffect, useState } from 'react';

import { isMobile } from './media-queries';

/** Reactively tracks whether the viewport is currently in mobile width. */
export default function useIsMobile() {
    const [mobile, setMobile] = useState(isMobile);

    useEffect(() => {
        const updateViewportMode = () => {
            setMobile(isMobile());
        };

        updateViewportMode();
        window.addEventListener('resize', updateViewportMode);
        window.addEventListener('orientationchange', updateViewportMode);

        return () => {
            window.removeEventListener('resize', updateViewportMode);
            window.removeEventListener('orientationchange', updateViewportMode);
        };
    }, []);

    return mobile;
}
