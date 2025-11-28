import { useEffect, useRef } from 'react';

// Plugins
import videoJsQualitySelector from '@silvermine/videojs-quality-selector';
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Custom hook for Video.js translations override
import useVideojsLanguages from '../hooks/useVideojsLanguages';

videoJsQualitySelector(videojs);

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
                { fluid: true, ...options },
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

    // Update player language when customLanguages changes
    useEffect(() => {
        const player = playerRef.current;

        if (player && customLanguages) {
            const { language, strings } = customLanguages;
            const currentPlayerLanguage = player.language();

            // Only update if the language actually changed
            if (currentPlayerLanguage !== language) {
                // Add/update the language strings in Video.js
                videojs.addLanguage(language, strings);

                // Set the player's language
                player.language(language);

                // Force refresh the player UI to apply new language strings
                if (
                    player.controlBar &&
                    typeof player.controlBar.update === 'function'
                ) {
                    player.controlBar.update();
                }
            }

            // Store plugin translations on the player instance so plugins can access them
            if (customLanguages.pluginTranslations) {
                player.pluginTranslations = customLanguages.pluginTranslations;

                // Trigger an event so plugins can update their translations
                player.trigger(
                    'pluginTranslationsUpdated',
                    customLanguages.pluginTranslations
                );
            }
        }
    }, [customLanguages]);

    // Handle big play button click when video is playing (to pause) and update title on hover
    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        const bigPlayButton = player.bigPlayButton?.el();
        if (!bigPlayButton) return;

        const handleBigPlayButtonClick = (e) => {
            // Only handle click if video is playing
            if (!player.paused()) {
                e.preventDefault();
                e.stopPropagation();
                player.pause();
            }
        };

        const updateTitle = () => {
            const isPaused = player.paused();
            const playText = player.localize('Play');
            const pauseText = player.localize('Pause');
            bigPlayButton.setAttribute(
                'title',
                isPaused ? playText : pauseText
            );
        };

        const handleMouseEnter = () => {
            updateTitle();
        };

        // Update title on play/pause events
        player.on('play', updateTitle);
        player.on('pause', updateTitle);

        bigPlayButton.addEventListener('click', handleBigPlayButtonClick, true);
        bigPlayButton.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            player.off('play', updateTitle);
            player.off('pause', updateTitle);
            bigPlayButton.removeEventListener(
                'click',
                handleBigPlayButtonClick,
                true
            );
            bigPlayButton.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

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
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio ref={videoRef} className={mediaElementClassName} />
            ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
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
