import { useEffect, useRef } from 'react';

import { useSidebar } from 'modules/sidebar';
import PropTypes from 'prop-types';
import useResizeAware from 'react-resize-aware';

import {
    SCREEN_WIDTH_ABOVE_XL,
    SCREEN_WIDTH_BELOW_M,
    currentScreenWidth,
} from './media-queries';

export default function ResizeWatcher({ children }) {
    const previousScreenWidth = useRef(null);
    const [resizeListener, sizes] = useResizeAware();
    const { hide, show } = useSidebar();

    useEffect(() => {
        const oldWidth = previousScreenWidth.current;
        const newWidth = currentScreenWidth();

        // First measurement only establishes the baseline.
        if (oldWidth === null) {
            previousScreenWidth.current = newWidth;
            return;
        }

        if (oldWidth === newWidth) {
            return;
        }

        if (newWidth === SCREEN_WIDTH_ABOVE_XL) {
            show();
        }
        if (newWidth === SCREEN_WIDTH_BELOW_M) {
            hide();
        }
        previousScreenWidth.current = newWidth;
    }, [sizes.width, show, hide]);

    return (
        <div style={{ position: 'relative' }}>
            {resizeListener}
            {children}
        </div>
    );
}

ResizeWatcher.propTypes = {
    children: PropTypes.node.isRequired,
};
