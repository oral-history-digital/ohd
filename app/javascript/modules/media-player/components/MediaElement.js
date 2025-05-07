import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { usePathBase, useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { useTimeQueryString } from 'modules/query-string';
import usePosterImage from '../usePosterImage';
import mediaStreamsToSources from '../mediaStreamsToSources';
import humanTimeToSeconds from '../humanTimeToSeconds';
import VideoJS from './VideoJS';
import './configurationMenuPlugin.js';
import './toggleSizeButtonPlugin.js';

const KEYCODE_F = 70;
const KEYCODE_M = 77;
const KEYCODE_P = 80;
const KEYCODE_SPACE = 32;
const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;

const FORWARD_STEP = 5;
const BACKWARD_STEP = 5;

const READY_STATE_HAVE_CURRENT_DATA = 2;

export default function MediaElement({
    archiveId,
    className,
    interview,
    mediaStreams,
    tape,
    timeChangeRequestAvailable,
    timeChangeRequest,
    updateIsPlaying,
    updateMediaTime,
    resetMedia,
    sendTimeChangeRequest,
    clearTimeChangeRequest,
}) {
    const pathBase = usePathBase();
    const { t, locale } = useI18n();
    const { project } = useProject();
    const playerRef = useRef(null);
    const tapeRef = useRef(tape); // Used for event handler below.

    const { tape: tapeParam, time: timeParam } = useTimeQueryString();

    const aspectRatio = `${project.aspect_x}:${project.aspect_y}`;
    const initialSources =
        mediaStreams &&
        mediaStreamsToSources(
            Object.values(mediaStreams),
            pathBase,
            interview.media_type,
            archiveId,
            interview.tape_count,
            tape
        );

    const { posterUrl } = usePosterImage(interview);

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: false,
        fluid: false,
        //aspectRatio,
        language: locale,
        sources: initialSources,
        poster: posterUrl,
        playbackRates: [0.6, 0.8, 1, 1.2, 2],
        enableSourceset: false,
        controlBar: {
            volumePanel: {
                inline: false,
                volumeControl: {
                    vertical: true,
                },
            },
            children: [
                'progressControl',
                'skipBackward',
                'playToggle',
                'skipForward',
                'volumePanel',
                'playbackRateMenuButton',
                'qualitySelector',
                'subsCapsButton',
                'fullscreenToggle',
            ],
            skipButtons: {
                forward: FORWARD_STEP,
                backward: BACKWARD_STEP,
            },
        },
        userActions: {
            click: true,
            doubleClick: true,
            hotkeys: handleKeyPress,
        },
    };

    function handleKeyPress(event) {
        let newTime, newVolume;

        switch (event.which) {
            case KEYCODE_F:
                if (this.isFullscreen()) {
                    this.exitFullscreen();
                } else {
                    this.requestFullscreen();
                }
                break;
            case KEYCODE_M:
                if (this.muted()) {
                    this.muted(false);
                } else {
                    this.muted(true);
                }
                break;
            case KEYCODE_P:
            case KEYCODE_SPACE:
                if (this.paused()) {
                    this.play();
                } else {
                    this.pause();
                }
                break;
            case KEYCODE_LEFT:
                newTime = this.currentTime() - BACKWARD_STEP;
                if (newTime < 0) {
                    newTime = 0;
                }
                this.currentTime(newTime);
                break;
            case KEYCODE_RIGHT:
                newTime = this.currentTime() + FORWARD_STEP;
                this.currentTime(newTime);
                break;
            case KEYCODE_UP:
                newVolume = this.volume() + 0.1;
                if (newVolume > 1) {
                    newVolume = 1;
                }
                this.volume(newVolume);
                break;
            case KEYCODE_DOWN:
                newVolume = this.volume() - 0.1;
                if (newVolume < 0) {
                    newVolume = 0;
                }
                this.volume(newVolume);
                break;
            default:
        }
    }

    // Update the player's poster when it changes
    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        // Only update if the poster has changed and player is ready
        player.poster(posterUrl);
    }, [posterUrl]);

    // Check if time params exist in query string.
    useEffect(() => {
        const numTapes = Number.parseInt(interview.tape_count);

        if (tapeParam && timeParam) {
            try {
                const timeInSeconds = humanTimeToSeconds(timeParam);
                // TODO: Validate tape and time params.
                sendTimeChangeRequest(
                    Math.max(Math.min(tapeParam, numTapes), 1),
                    timeInSeconds
                );
            } catch (e) {
                console.warn('Invalid time format, skipping');
            }
        }
    }, []);

    // Reset media position on unmount.
    useEffect(() => {
        return resetMedia;
    }, []);

    // Update sources and tracks if tape has been changed.
    useEffect(() => {
        const player = playerRef.current;
        if (!player) {
            return;
        }

        tapeRef.current = tape;

        const newSources = mediaStreamsToSources(
            Object.values(mediaStreams),
            pathBase,
            interview.media_type,
            archiveId,
            interview.tape_count,
            tape
        );

        player.src(newSources);

        addTextTracks();
    }, [tape, interview.transcript_coupled]);

    // Check if time has been changed from outside of component.
    useEffect(() => {
        // Now checking on every render because otherwise tape and time params
        // are not recognized.
        checkForTimeChangeRequest();
    });

    function addTextTracks() {
        if (!interview.transcript_coupled) return;

        const player = playerRef.current;
        if (!player) {
            return;
        }

        // Remove old text tracks, if any.
        const tracks = player.remoteTextTracks();
        for (let i = tracks.length - 1; i >= 0; i--) {
            player.removeRemoteTextTrack(tracks[i]);
        }

        // Use tape number from ref since this function is called from event
        // handler.
        const actualTape = tapeRef.current;
        // Add new text tracks.
        const newTracks = interview.languages.map((lang) => ({
            src: `${pathBase}/interviews/${archiveId}.vtt?lang=${lang}&tape_number=${actualTape}`,
            language: lang,
            kind: 'captions',
            label: t(lang),
        }));
        newTracks.forEach((newTrack) => {
            player.addRemoteTextTrack(newTrack, false);
        });
    }

    function checkForTimeChangeRequest() {
        // We use Redux as an event system here.
        // If a request is available, it is immediately cleared and processed.
        const player = playerRef.current;
        if (!player) {
            return;
        }

        if (timeChangeRequestAvailable) {
            clearTimeChangeRequest();

            player.currentTime(timeChangeRequest);

            if (player.readyState() >= READY_STATE_HAVE_CURRENT_DATA) {
                player.play();
            } else {
                player.autoplay(true);
            }
        }
    }

    function handlePlayEvent() {
        updateIsPlaying(true);
    }

    function handlePauseEvent() {
        updateIsPlaying(false);
    }

    function handleTimeUpdateEvent() {
        const time = playerRef.current.currentTime();
        const roundedTime = Math.round(time * 10) / 10;
        updateMediaTime(roundedTime);
    }

    function handleEndedEvent() {
        if (tape >= Number(interview.tape_count)) {
            return;
        }

        sendTimeChangeRequest(tape + 1, 0);
    }

    function handleContextMenuEvent(e) {
        e.preventDefault();
        return false;
    }

    function handleQualitySelected() {
        /*
         * Add text tracks again after quality is selected.
         * Otherwise, they are lost.
         */
        addTextTracks();
    }

    function handlePlayerReady(player) {
        playerRef.current = player;
        window.mainPlayerInstance = player;

        player.configurationMenuPlugin();
        player.toggleSizePlugin({
            buttonTitle: t('media_player.toggle_size_button')
        });

        const qualities = player
            .currentSources()
            .map((source) =>
                source.label || (source.height ? `${source.height}p` : 'Default')
            )
            .filter(Boolean);

        player.configurationMenuPlugin({
            playbackRates: videoJsOptions.playbackRates,
            qualities: qualities,
            translations: {
                playbackRate: t('media_player.playback_rate'),
                playbackQuality: t('media_player.playback_quality')
              }
        });

        player.ready(() => {
            const configControl = player.controlBar.getChild('ConfigurationControl');
            const playbackRateMenuButton = player.controlBar.getChild('playbackRateMenuButton');
            const qualitySelector = player.controlBar.getChild('qualitySelector');
            const toggleSizeButton = player.controlBar.getChild('ToggleSizeButton');
            const subsCapsButton = player.controlBar.getChild('subsCapsButton');

            const currentSize = toggleSizeButton ? toggleSizeButton.currentPlayerSize : 'medium';

            // Disable subtitles if start size is small
            if (currentSize === 'small' && subsCapsButton) {
                subsCapsButton.disable();
                const textTracks = player.textTracks();
                for (let i = 0; i < textTracks.length; i++) {
                    if (textTracks[i].mode === 'showing') {
                        textTracks[i].mode = 'disabled';
                    }
                }
            }

            if (player.isFullscreen()) {
                if (configControl) configControl.hide();
                if (playbackRateMenuButton) playbackRateMenuButton.show();
                if (qualitySelector) qualitySelector.show();
                if (toggleSizeButton) toggleSizeButton.hide();

                // Enable subtitles button in fullscreen
                if (subsCapsButton) {
                    subsCapsButton.enable();

                    // If toggleSizeButton exists and has saved subtitles, restore them
                    if (toggleSizeButton && toggleSizeButton.subtitleTrackWasEnabled) {
                        toggleSizeButton.restoreActiveSubtitleTrack();
                    }
                }
            } else {
                if (configControl) configControl.show();
                if (playbackRateMenuButton) playbackRateMenuButton.hide();
                if (qualitySelector) qualitySelector.hide();
                if (toggleSizeButton) toggleSizeButton.show();

                // When exiting fullscreen, check if we need to disable subtitles
                if (toggleSizeButton && toggleSizeButton.currentPlayerSize === 'small') {
                    if (subsCapsButton) {
                        // Save current subtitle state before disabling
                        if (toggleSizeButton.saveActiveSubtitleTrack) {
                            toggleSizeButton.saveActiveSubtitleTrack();
                        }

                        subsCapsButton.disable();

                        // Disable active subtitle tracks
                        const textTracks = player.textTracks();
                        for (let i = 0; i < textTracks.length; i++) {
                            if (textTracks[i].mode === 'showing') {
                                textTracks[i].mode = 'disabled';
                            }
                        }
                    }
                }
            }
        });

        player.on('fullscreenchange', () => {
            const configControl = player.controlBar.getChild('ConfigurationControl');
            const playbackRateMenuButton = player.controlBar.getChild('playbackRateMenuButton');
            const qualitySelector = player.controlBar.getChild('qualitySelector');
            const toggleSizeButton = player.controlBar.getChild('ToggleSizeButton');

            if (player.isFullscreen()) {
                if (configControl) configControl.hide();
                if (playbackRateMenuButton) playbackRateMenuButton.show();
                if (qualitySelector) qualitySelector.show();
                if (toggleSizeButton) toggleSizeButton.hide();
            } else {
                if (configControl) configControl.show();
                if (playbackRateMenuButton) playbackRateMenuButton.hide();
                if (qualitySelector) qualitySelector.hide();
                if (toggleSizeButton) toggleSizeButton.show();
            }
        });


        addTextTracks();

        player.on('play', handlePlayEvent);
        player.on('pause', handlePauseEvent);
        player.on('timeupdate', handleTimeUpdateEvent);
        player.on('ended', handleEndedEvent);
        player.on('contextmenu', handleContextMenuEvent);
        player.on('qualitySelected', handleQualitySelected);

        checkForTimeChangeRequest();
    }

    useEffect(() => {
        return resetMedia;
    }, []);

    useEffect(() => {
        return () => {
            window.mainPlayerInstance = null;
        };
    }, []);

    if (!mediaStreams) {
        return null;
    }

    return (
        <div
            className={classNames(
                'MediaElement',
                className,
                `MediaElement--${aspectRatio}`,
                {
                    'MediaElement--video': interview.media_type === 'video',
                    'MediaElement--audio': interview.media_type === 'audio',
                }
            )}
        >
            <VideoJS
                type={interview.media_type}
                options={videoJsOptions}
                onReady={handlePlayerReady}
                onEnded={handleEndedEvent}
            />
        </div>
    );
}

MediaElement.propTypes = {
    archiveId: PropTypes.string.isRequired,
    className: PropTypes.string,
    interview: PropTypes.object.isRequired,
    mediaStreams: PropTypes.object.isRequired,
    tape: PropTypes.number,
    timeChangeRequestAvailable: PropTypes.bool,
    timeChangeRequest: PropTypes.number,
    updateIsPlaying: PropTypes.func.isRequired,
    updateMediaTime: PropTypes.func.isRequired,
    resetMedia: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
    clearTimeChangeRequest: PropTypes.func.isRequired,
};
