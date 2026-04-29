import { getLocale } from 'modules/archive';
import { useSelector } from 'react-redux';

export default function StartPageVideo() {
    const locale = useSelector(getLocale);

    return (
        <div className="StartPageVideo MediaElement--poster">
            <video
                poster="https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/still-home-video.jpg"
                controls
                src={`https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/mog_home_movie_${locale}_1803.mp4`}
            >
                {/* Empty track element to prevent warnings. Add captions here if available */}
                <track kind="captions" />{' '}
            </video>
        </div>
    );
}
