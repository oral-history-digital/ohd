import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Plugins
import videoJsQualitySelector from '@silvermine/videojs-quality-selector';
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';
videoJsQualitySelector(videojs);

// Custom hook for Video.js translations override
import useVideojsLanguages from '../hooks/useVideojsLanguages';

export default function VideoJS({
    className,
    type,
    options,
    onReady,
    onEnded,
}) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // Use the hook to set up custom translations
    const customLanguages = useVideojsLanguages();

    useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) {
                return;
            }

            const player = (playerRef.current = videojs(
                videoElement,
                options,
                () => {
                    onReady && onReady(player);
                }
            ));
        } else {
            // you can update player here [update player through props]
            // const player = playerRef.current;
            // player.autoplay(options.autoplay);
            // player.src(options.sources);

            const player = playerRef.current;
            // Update the event handler because it is cached by Videojs.
            if (typeof onEnded === 'function') {
                player.off('ended');
                player.on('ended', onEnded);
            }
        }
    }, [options, videoRef, onReady, onEnded, customLanguages]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    const mediaElementClassName =
        'MediaElement-element video-js vjs-default-skin';

    return (
        <div data-vjs-player className={className}>
            {type === 'audio' ? (
                <audio ref={videoRef} className={mediaElementClassName} />
            ) : (
                <video ref={videoRef} className={mediaElementClassName} />
            )}
        </div>
    );
}

VideoJS.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['audio', 'video']).isRequired,
    options: PropTypes.object,
    onReady: PropTypes.func,
    onEnded: PropTypes.func,
};
