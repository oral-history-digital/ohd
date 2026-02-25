import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import useResizeAware from 'react-resize-aware';
import { useLocation } from 'react-router-dom';

import {
    SCREEN_WIDTH_ABOVE_XL,
    SCREEN_WIDTH_BELOW_M,
    currentScreenWidth,
} from './media-queries';

export default function ResizeWatcher({ children, hideSidebar, showSidebar }) {
    const [screenWidth, setScreenWidth] = useState(null);
    const [resizeListener, sizes] = useResizeAware();
    const location = useLocation();

    useEffect(() => {
        handleResize();
    }, [sizes.width]);

    function handleResize() {
        const oldWidth = screenWidth;
        const newWidth = currentScreenWidth();

        if (oldWidth === newWidth) {
            return;
        }

        // Don't auto-open sidebar on startpage (/:locale pattern)
        const isStartpage = /^\/[a-z]{2}$/.test(location.pathname);

        if (newWidth === SCREEN_WIDTH_ABOVE_XL && !isStartpage) {
            showSidebar();
        }
        if (newWidth === SCREEN_WIDTH_BELOW_M) {
            hideSidebar();
        }

        setScreenWidth(newWidth);
    }

    return (
        <div style={{ position: 'relative' }}>
            {resizeListener}
            {children}
        </div>
    );
}

ResizeWatcher.propTypes = {
    children: PropTypes.node.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    showSidebar: PropTypes.func.isRequired,
};
