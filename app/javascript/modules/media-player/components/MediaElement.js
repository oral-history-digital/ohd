import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { t } from 'modules/i18n';
import missingStill from 'assets/images/missing_still.png';

export default class MediaElement extends React.Component {
    constructor(props) {
        super(props);

        this.fullscreenChange = this.fullscreenChange.bind(this);

        this.tracksVisible = false;
    }

    componentDidMount() {
        let initialResolution = this.props.interview.media_type === 'audio' ? '192k' : '480p';
        this.props.setTapeAndTimeAndResolution(this.props.tape, this.props.videoTime, initialResolution);
        if (this.video) {
            this.setVideoTime()
            this.setVideoStatus()
            this.video.addEventListener('webkitfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('mozfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('fullscreenchange', this.fullscreenChange);
            this.video.addEventListener('contextmenu',function(e) { e.preventDefault(); return false; });
        }
    }

    componentDidUpdate() {
        if (this.video) {
            this.setVideoTime()
            this.setVideoStatus()
            this.video.addEventListener('contextmenu',function(e) { e.preventDefault(); return false; });
        }
    }

    componentWillUnmount() {
        // reset resolution to undefined, otherwise changing video to audio or audio to video will crash
        this.props.setTapeAndTimeAndResolution(this.props.tape, this.video && this.video.currentTime, undefined);
    }

    setVideoTime() {
        if (this.props.videoTime !== 0) {
            this.video.currentTime = this.props.videoTime;
        }
    }

    setVideoStatus() {
        // let isPlaying = this.video.currentTime > 0 && !this.video.paused && !this.video.ended && this.video.readyState > 2;
        this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
    }

    handleVideoEnded() {
        if (this.props.tape < this.props.interview.tape_count) {
            this.props.setNextTape();
        } else {
            this.props.handleVideoEnded();
        }
    }

    src() {
        if(this.props.interview.media_type && this.props.resolution) {
            let mediaStream = Object.values(this.props.mediaStreams).find(m => {
                return m.media_type === this.props.interview.media_type &&
                    m.resolution === this.props.resolution
            });
            return mediaStream?.path.replace(/#\{archive_id\}/g, this.props.archiveId).
                replace(/#\{tape_count\}/, this.props.interview.tape_count).
                replace(/#\{tape_number\}/, (this.props.tape.toString().length > 1 ? this.props.tape : `0${this.props.tape}`));
        } else {
            return null;
        }
    }

    defaultTitle() {
        moment.locale(this.props.locale);
        let now = moment().format('lll');
        return `${this.props.archiveId} - ${this.props.interview.short_title[this.props.locale]} - ${now}`;
    }

    fullscreenChange() {
        let isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        if (isFullscreen) {
            this.tracksVisible = false;
            let tracks = {};
            for (let i = 0; i < this.video.textTracks.length; i++) {
                if (this.video.textTracks[i].mode === "showing") {
                    this.tracksVisible = true;
                }
                tracks[this.video.textTracks[i].language] = this.video.textTracks[i];
            }
            if (!this.tracksVisible) {
                tracks[this.props.locale].mode = 'showing';
            }
        } else {
            if (!this.tracksVisible) {
                for (let i = 0; i < this.video.textTracks.length; i++) {
                    this.video.textTracks[i].mode = 'disabled';
                }
            }
        }
    }

    subtitles() {
        return this.props.interview.languages.map((language) => {
            return (
                <track
                    key={`subtitle-${language}-${this.props.locale}-${this.props.tape}`}
                    kind="subtitles"
                    label={t(this.props, language)}
                    src={this.props.archiveId + '.vtt?lang=' + language + '&tape_number=' + this.props.tape}
                    srcLang={language}
                />
            )
        })
    }

    handleVideoClick() {
        if(this.video) {
            if(navigator.userAgent.indexOf("Chrome") != -1 )
            {
                this.video.paused ? this.video.play() : this.video.pause();
            }
        }
    }

    render() {
        return(
            React.createElement(
                this.props.projectId == 'dg' ? 'audio' : 'video',
                {
                    ref: video => { this.video = video; },
                    onTimeUpdate: event => {
                        var time = Math.round(event.target.currentTime * 100) / 100;
                        if (time !== this.props.videoTime) {
                            this.props.handleVideoTimeChange(time);
                        }
                    },
                    onEnded: () => {
                        this.handleVideoEnded();
                    },
                    playsInline: true,
                    controls: true,
                    controlsList: "nodownload",
                    poster: this.props.interview.still_url || missingStill,
                    onClick: this.handleVideoClick,
                    src: this.src(),
                },
                (this.props.projectId != 'dg') && this.subtitles()
              )
        );
    }
}

MediaElement.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    mediaStreams: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    resolution: PropTypes.string.isRequired,
    tape: PropTypes.number.isRequired,
    translations: PropTypes.object.isRequired,
    videoStatus: PropTypes.string.isRequired,
    videoTime: PropTypes.number.isRequired,
    handleVideoEnded: PropTypes.func,
    handleVideoTimeChange: PropTypes.func.isRequired,
    setNextTape: PropTypes.func.isRequired,
    setTapeAndTimeAndResolution: PropTypes.func.isRequired,
};
