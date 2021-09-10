import { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';

import speakerImage from 'assets/images/speaker.png';

export default class MediaElement extends Component {
    constructor(props) {
        super(props);

        this.mediaElement = createRef();

        this.handlePlayEvent = this.handlePlayEvent.bind(this);
        this.handlePauseEvent = this.handlePauseEvent.bind(this);
        this.handleTimeUpdateEvent = this.handleTimeUpdateEvent.bind(this);
        this.handleCanPlayEvent = this.handleCanPlayEvent.bind(this);
        this.handleEndedEvent = this.handleEndedEvent.bind(this);
        this.checkForTimeChangeRequest = this.checkForTimeChangeRequest.bind(this);
    }

    componentDidMount() {
        let initialResolution = this.props.interview.media_type === 'audio' ? '192k' : '480p';
        this.props.setResolution(initialResolution);

        const mediaElement = this.mediaElement.current;
        mediaElement.addEventListener('play', this.handlePlayEvent);
        mediaElement.addEventListener('pause', this.handlePauseEvent);
        mediaElement.addEventListener('timeupdate', this.handleTimeUpdateEvent);
        mediaElement.addEventListener('ended', this.handleEndedEvent);
        mediaElement.addEventListener('contextmenu', this.handleContextMenuEvent);

        this.checkForTimeChangeRequest();
    }

    componentDidUpdate() {
        this.checkForTimeChangeRequest();
    }

    componentWillUnmount() {
        this.props.resetMedia();

        const mediaElement = this.mediaElement.current;
        mediaElement.removeEventListener('play', this.handlePlayEvent);
        mediaElement.removeEventListener('pause', this.handlePauseEvent);
        mediaElement.removeEventListener('timeupdate', this.handleTimeUpdateEvent);
        mediaElement.removeEventListener('ended', this.handleEndedEvent);
        mediaElement.removeEventListener('contextmenu', this.handleContextMenuEvent);
        mediaElement.removeEventListener('canplay', this.handleCanPlayEvent);
    }

    handlePlayEvent() {
        this.props.updateIsPlaying(true);
    }

    handlePauseEvent() {
        this.props.updateIsPlaying(false);
    }

    handleTimeUpdateEvent(e) {
        const time = Math.round(e.target.currentTime * 10) / 10;
        this.props.updateMediaTime(time);
    }

    handleEndedEvent() {
        const { tape, interview, sendTimeChangeRequest } = this.props;

        if (tape < interview.tape_count) {
            sendTimeChangeRequest(tape + 1, 0);
        }
    }

    handleContextMenuEvent(e) {
        e.preventDefault();
        return false;
    }

    handleCanPlayEvent(e) {
        const mediaElement = this.mediaElement.current;

        mediaElement.removeEventListener('canplay', this.handleCanPlayEvent);

        mediaElement.play().catch((err) => {
            console.log(err);
        });
    }

    checkForTimeChangeRequest() {
        // We use Redux as an event system here.
        // If a request is available, it is immediately cleared and processed.
        if (this.props.timeChangeRequestAvailable) {
            this.props.clearTimeChangeRequest();

            const mediaElement = this.mediaElement.current;

            mediaElement.currentTime = this.props.timeChangeRequest;

            // If medium is ready, play it directly, if not, play it when ready.
            if (mediaElement.readyState >= 2) {
                mediaElement.play().catch((err) => {
                    console.log(err);
                });
            } else {
                mediaElement.addEventListener('canplay', this.handleCanPlayEvent);
            }
        }
    }

    src() {
        if(this.props.interview.media_type && this.props.resolution) {
            let mediaStream = Object.values(this.props.mediaStreams).find(m => {
                return m.media_type === this.props.interview.media_type &&
                    m.resolution === this.props.resolution
            });
            return mediaStream?.path.replace(/INTERVIEW_ID/g, this.props.archiveId).
                replace(/TAPE_COUNT/g, this.props.interview.tape_count).
                replace(/TAPE_NUMBER/g, (this.props.tape.toString().length > 1 ? this.props.tape : `0${this.props.tape}`));
        } else {
            return null;
        }
    }

    render() {
        const { interview, className, tape, archiveId, locale, projectId, projects } = this.props;

        const isVideo = interview.media_type === 'video';
        const pathBaseStr = pathBase({projectId, locale, projects});

        return (
            <div className={classNames('MediaElement', className, isVideo ? 'MediaElement--video' : 'MediaElement--audio')}>
                <video
                    ref={this.mediaElement}
                    className="MediaElement-element"
                    controls
                    controlsList="nodownload"
                    poster={interview.still_url || speakerImage}
                    src={this.src()}
                >
                    {
                        isVideo && interview.languages.map(language => (
                            <track
                                key={language}
                                kind="subtitles"
                                label={t(this.props, language)}
                                src={`${pathBaseStr}/interviews/${archiveId}.vtt?lang=${language}&tape_number=${tape}`}
                                srcLang={language}
                            />
                        ))
                    }
                </video>
            </div>
        );
    }
}

MediaElement.propTypes = {
    className: PropTypes.string,
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    mediaStreams: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    resolution: PropTypes.string,
    tape: PropTypes.number.isRequired,
    timeChangeRequest: PropTypes.number,
    timeChangeRequestAvailable: PropTypes.bool.isRequired,
    translations: PropTypes.object.isRequired,
    updateMediaTime: PropTypes.func.isRequired,
    updateIsPlaying: PropTypes.func.isRequired,
    setResolution: PropTypes.func.isRequired,
    resetMedia: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
    clearTimeChangeRequest: PropTypes.func.isRequired,
};
