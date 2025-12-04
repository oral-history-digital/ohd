import { useEffect, useState } from 'react';

import throttle from 'lodash.throttle';
import {
    SITE_HEADER_HEIGHT_DESKTOP,
    SITE_HEADER_HEIGHT_MOBILE,
} from 'modules/constants';
import { isMobile } from 'modules/user-agent';

export function useScrollBelowThreshold() {
    const [isBelow, setIsBelow] = useState(false);

    useEffect(() => {
        const updateMediaPlayerHeight = () => {
            const mediaPlayer = document.querySelector('.MediaPlayer');
            const contentTabs = document.querySelector('.Layout-contentTabs');

            if (mediaPlayer && contentTabs) {
                const playerHeight = mediaPlayer.offsetHeight;
                const tabsHeight = contentTabs.offsetHeight;

                // Set CSS custom properties for sticky positioning
                document.documentElement.style.setProperty(
                    '--media-player-actual-height',
                    `${playerHeight}px`
                );
                document.documentElement.style.setProperty(
                    '--sticky-content-offset',
                    `${playerHeight + tabsHeight}px`
                );
            }
        };

        const handleScroll = (e) => {
            const scrollY = e.target.scrollingElement.scrollTop;

            // Calculate header height
            const headerHeight = isMobile()
                ? SITE_HEADER_HEIGHT_MOBILE
                : SITE_HEADER_HEIGHT_DESKTOP;

            // Trigger after scrolling 1/3 of the header height
            const stickyThreshold = headerHeight / 3;

            if (scrollY > stickyThreshold) {
                setIsBelow(true);
                // Update heights when becoming sticky
                updateMediaPlayerHeight();
            } else {
                setIsBelow(false);
            }
        };

        const throttledHandleScroll = throttle(handleScroll, 100);

        window.addEventListener('scroll', throttledHandleScroll);

        // Set initial heights
        updateMediaPlayerHeight();

        // Also update on window resize
        const handleResize = throttle(() => {
            updateMediaPlayerHeight();
        }, 100);
        window.addEventListener('resize', handleResize);

        // Update when media player is manually resized via drag handle
        const handleMediaPlayerResize = () => {
            updateMediaPlayerHeight();
        };
        window.addEventListener('mediaPlayerResized', handleMediaPlayerResize);

        // Initial check in case page is loaded already scrolled
        handleScroll({
            target: { scrollingElement: document.documentElement },
        });

        const cleanup = () => {
            window.removeEventListener('scroll', throttledHandleScroll);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener(
                'mediaPlayerResized',
                handleMediaPlayerResize
            );
        };

        return cleanup;
    }, []); // Empty dependency array - set up once on mount

    return isBelow;
}
