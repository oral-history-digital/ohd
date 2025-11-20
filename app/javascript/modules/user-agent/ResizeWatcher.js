import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useResizeAware from 'react-resize-aware';

import {
    SCREEN_WIDTH_BELOW_M,
    SCREEN_WIDTH_ABOVE_XL,
    currentScreenWidth,
} from './media-queries';

export default function ResizeWatcher({ children, hideSidebar, showSidebar }) {
    const [screenWidth, setScreenWidth] = useState(null);
    const [resizeListener, sizes] = useResizeAware();

    useEffect(() => {
        handleResize();
    }, [sizes.width]);

    function handleResize() {
        const oldWidth = screenWidth;
        const newWidth = currentScreenWidth();

        if (oldWidth === newWidth) {
            return;
        }

        if (newWidth === SCREEN_WIDTH_ABOVE_XL) {
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
