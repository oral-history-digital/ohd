import React from 'react';
import PropTypes from 'prop-types';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import { t, fullname, segments, activeSegment, getInterviewee } from '../../../lib/utils';
import moment from 'moment';

import { MISSING_STILL } from '../constants/archiveConstants'

export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.fullscreenChange = this.fullscreenChange.bind(this);
        this.tracksVisible = false;
        this.handleTapeChange = this.handleTapeChange.bind(this);
        this.handleResolutionChange = this.handleResolutionChange.bind(this);
    }

    componentDidMount() {
        // set resolution to default as defined in project conf
        if (this.props.mediaStreams) {
            let initialResolution = this.props.mediaStreams['defaults'][this.props.interview.media_type]
            this.props.setTapeAndTimeAndResolution(this.props.tape, this.video.currentTime, initialResolution);
        }
        if (this.video) {
            this.setVideoTime()
            this.setVideoStatus()
            this.video.addEventListener('webkitfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('mozfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('fullscreenchange', this.fullscreenChange);
            this.video.addEventListener('contextmenu',function(e) { e.preventDefault(); return false; });
        }
    }

    componentDidUpdate(prevProps) {
        // set resolution as soon as mediaStreams are available
        if(!prevProps.mediaStreams && this.props.mediaStreams) {
            let initialResolution = this.props.mediaStreams['defaults'][this.props.interview.media_type]
            this.props.setTapeAndTimeAndResolution(this.props.tape, this.video.currentTime, initialResolution);
        }

        if (this.video) {
            this.setVideoTime()
            this.setVideoStatus()
            this.video.addEventListener('contextmenu',function(e) { e.preventDefault(); return false; });
        }
    }

    componentWillUnmount() {
        // reset resolution to undefined, otherwise changing video to audio or audio to video will crash
        this.props.setTapeAndTimeAndResolution(this.props.tape, this.video.currentTime, undefined);
    }

    handleTapeChange(e) {
        this.props.setTapeAndTimeAndResolution(parseInt(e.target.value), 0, this.props.resolution);
    }

    handleResolutionChange(e) {
        this.props.setTapeAndTimeAndResolution(this.props.tape, this.video.currentTime, e.target.value, this.video.paused ? 'pause' : 'play');
    }

    setVideoTime() {
        this.video.currentTime = this.props.videoTime;
    }

    setVideoStatus() {
        // let isPlaying = this.video.currentTime > 0 && !this.video.paused && !this.video.ended && this.video.readyState > 2;
        this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
    }

    reconnectVideoProgress() {
        this.props.handleTranscriptScroll(false);
        window.scrollTo(0, 1);
    }

    compressVideo() {
        this.props.handleTranscriptScroll(true);
    }

    handleVideoEnded() {
        if (this.props.tape < this.props.interview.tape_count) {
            this.props.setNextTape();
        } else {
            this.props.handleVideoEnded();
        }
    }

    src() {
        // this will run only if tape_count < 10!!
        if(this.props.mediaStreams && this.props.resolution) {
            let url = this.props.mediaStreams[this.props.interview.media_type][this.props.resolution];
                url = url.replace(/\#\{archive_id\}/g, (this.props.project === 'mog') ? this.props.archiveId : this.props.archiveId.toUpperCase());
                url = url.replace(/\#\{tape_count\}/g, this.props.interview.tape_count);
                url = url.replace(/\#\{tape_number\}/g, this.props.tape);
                return url;
        } else {
        return null;
        }
    }

    rememberInterviewLink() {
        return <div className="video-bookmark" onClick={() => this.props.openArchivePopup({
            title: t(this.props, 'save_interview_reference') + ": " + this.props.interview.short_title[this.props.locale],
            content: this.rememberInterviewForm()
        })}>
            <i className="fa fa-star"></i>
            <span>{t(this.props, 'save_interview_reference')}</span>
        </div>
    }

    defaultTitle() {
        moment.locale(this.props.locale);
        let now = moment().format('lll');
        return `${this.props.archiveId} - ${this.props.interview.short_title[this.props.locale]} - ${now}`;
    }

    rememberInterviewForm() {
        return <UserContentFormContainer
            title={this.defaultTitle()}
            description=''
            properties={{title: this.props.interview.title}}
            reference_id={this.props.interview.id}
            reference_type='Interview'
            media_id={this.props.interview.archive_id}
            type='InterviewReference'
            submitLabel={t(this.props, 'notice')}
        />
    }

    annotateOnSegmentLink() {
        return (
            <div className="video-text-note" onClick={() => this.props.openArchivePopup({
                title: t(this.props, 'save_user_annotation'),
                content: this.annotateOnSegmentForm(
                    activeSegment(this.video.currentTime, this.props).id
                )
            })}>
                <i className="fa fa-pencil"></i>
                <span>{t(this.props, 'save_user_annotation')}</span>
            </div>
        );
    }

    annotateOnSegmentForm(segmentIndex) {
        let segment = segments(this.props)[segmentIndex];
        return <UserContentFormContainer
            title={this.defaultTitle()}
            description=''
            properties={{
                time: segment.time,
                tape_nbr: segment.tape_nbr,
                segmentIndex: segmentIndex,
                interview_archive_id: this.props.interview.archive_id
            }}
            reference_id={segment.id}
            reference_type='Segment'
            media_id={segment.media_id}
            segmentIndex={segmentIndex}
            type='UserAnnotation'
            workflow_state='private'
        />
    }

    fullscreenChange(event) {
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
        return this.props.interview.languages.map((language, index) => {
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
    
    tapeSelector(){
        let options = [];
        for(var i = 1; i <= this.props.interview.tape_count; i++) {
                options.push(<option value={i} key={'tape' + i}>{t(this.props, 'tape')} {i}</option>);
        }
        return options;
    }

    resolutionSelector(){
        let resolutions = Object.keys(this.props.mediaStreams[this.props.interview.media_type])
        if (resolutions.length > 1) {

            let options = [];
            for(var i = 0; i < resolutions.length; i++) {
                options.push(<option value={resolutions[i]} key={'resolution' + i}>{resolutions[i]}</option>);
            }
            return (
                <select value={this.props.resolution} onChange={this.handleResolutionChange} className={'resolutionselector'}>
                    {options}
                </select>
            )
        }
        else {
            return null;
        }
    }

    mediaElement() {
        let _this = this;
        return(
            React.createElement(
                _this.props.project == 'hagen' ? 'audio' : 'video',
                {
                  ref: function ref(video) {
                    _this.video = video;
                  },
                  onTimeUpdate: function onTimeUpdate(event) {
                    var time = Math.round(event.target.currentTime * 100) / 100;
                    if (time !== _this.props.videoTime) {
                      _this.props.handleVideoTimeChange(time);
                    }
                  },
                  onEnded: function onEnded(event) {
                    _this.handleVideoEnded();
                  },
                  playsInline: true,
                  controls: true,
                  controlsList: "nodownload",
                  poster: _this.props.interview.still_url || MISSING_STILL,
                  onClick: function onClick(e) {
                    return _this.handleVideoClick(e);
                  },
                  src: _this.src()
                },
                (_this.props.project != 'hagen') && _this.subtitles()
              )
        )
    }

    handleVideoClick(e) {
        if(this.video) {
            if(navigator.userAgent.indexOf("Chrome") != -1 )
            {
                this.video.paused ? this.video.play() : this.video.pause();
            }
        }
    }

    render() {
        if (this.props.project) {
            return (
                <div className='wrapper-video'>
                    <i className="fa fa-expand expand" aria-hidden="true" onClick={() => this.reconnectVideoProgress()} />
                    <i className="fa fa-compress compress" aria-hidden="true" onClick={() => this.compressVideo()} />
                    <div className={"video-title-container"}>
                        <h1 className='video-title'>
                            {fullname(this.props, getInterviewee(this.props), true)}
                        </h1>
                        <div className="video-icons-container">
                            <select value={this.props.tape} onChange={this.handleTapeChange} className={this.props.interview.tape_count == 1 ? 'hidden tapeselector' : 'tapeselector'}>
                                {this.tapeSelector()}
                            </select>
                            {this.resolutionSelector()}
                            {this.annotateOnSegmentLink()}
                            {this.rememberInterviewLink()}
                        </div>
                    </div>
                    <div className='video-element'>
                        {this.mediaElement(this)}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

VideoPlayer.propTypes = {
    handleVideoTimeUpdate: PropTypes.func,
    handleVideoEnded: PropTypes.func,
};
