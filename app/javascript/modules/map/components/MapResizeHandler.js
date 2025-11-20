import { useEffect } from 'react';

import { useMap } from 'react-leaflet';
import useResizeAware from 'react-resize-aware';

export default function MapResizeHandler() {
    const [resizeListener, sizes] = useResizeAware();
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();
    }, [sizes.width, sizes.height]);

    return resizeListener;
}
