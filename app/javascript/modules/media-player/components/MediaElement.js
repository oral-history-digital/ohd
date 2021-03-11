import React from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import missingStill from 'assets/images/missing_still.png';

export default class MediaElement extends React.Component {
    constructor(props) {
        super(props);

        this.mediaElement = React.createRef();

        this.handleMediaEnded = this.handleMediaEnded.bind(this);
    }

    componentDidMount() {
        let initialResolution = this.props.interview.media_type === 'audio' ? '192k' : '480p';

        this.props.setTapeAndTimeAndResolution(this.props.tape, this.props.mediaTime, initialResolution);

        this.setMediaTime()
        this.setMediaStatus()

        this.mediaElement.current.addEventListener('contextmenu', this.handleContextMenu);
    }

    componentDidUpdate() {
        this.setMediaTime()
        this.setMediaStatus()
    }

    componentWillUnmount() {
        // reset resolution to undefined, otherwise changing video to audio or audio to video will crash
        this.props.setTapeAndTimeAndResolution(this.props.tape, this.mediaElement.current.currentTime, undefined);

        this.mediaElement.current.removeEventListener('contextmenu', this.handleContextMenu);
    }

    handleContextMenu(e) {
        e.preventDefault();
        return false;
    }

    setMediaTime() {
        if (this.props.mediaTime !== 0) {
            this.mediaElement.current.currentTime = this.props.mediaTime;
        }
    }

    setMediaStatus() {
        this.props.mediaStatus === 'play' ? this.mediaElement.current.play() : this.mediaElement.current.pause();
    }

    handleMediaEnded() {
        if (this.props.tape < this.props.interview.tape_count) {
            this.props.setNextTape();
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

    render() {
        return(
            React.createElement(
                this.props.projectId == 'dg' ? 'audio' : 'video',
                {
                    ref: this.mediaElement,
                    onTimeUpdate: event => {
                        var time = Math.round(event.target.currentTime * 10) / 10;
                        if (time !== this.props.mediaTime) {
                            this.props.handleTimeChange(time);
                        }
                    },
                    onEnded: this.handleMediaEnded,
                    controls: true,
                    poster: this.props.interview.still_url || missingStill,
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
    mediaStatus: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    handleTimeChange: PropTypes.func.isRequired,
    setNextTape: PropTypes.func.isRequired,
    setTapeAndTimeAndResolution: PropTypes.func.isRequired,
};
