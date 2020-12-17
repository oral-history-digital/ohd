import React from 'react';
import { useSelector } from 'react-redux';

import { getLocale } from '../selectors/archiveSelectors';

export default function StartPageVideo() {
    const locale = useSelector(getLocale);

    return (
        <div className="VideoElement VideoElement--poster">
            <video
                poster="https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/still-home-video.jpg"
                controls
                src={`https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/mog_home_movie_${locale}_1803.mp4`}
            />
        </div>
    );
}
