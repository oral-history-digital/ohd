import React from 'react';
import PropTypes from 'prop-types';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import { t, fullname, segments, getSegmentId } from '../../../lib/utils';
import moment from 'moment';

import { MISSING_STILL } from '../constants/archiveConstants'

export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.fullscreenChange = this.fullscreenChange.bind(this);
        this.tracksVisible = false;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.video) {
            this.setVideoTime()
            this.setVideoStatus()
            this.video.addEventListener('webkitfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('mozfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('fullscreenchange', this.fullscreenChange);
        }
    }

    componentDidUpdate() {
        if (this.video) {
            this.setVideoTime()
            this.setVideoStatus()
        }
    }

    handleChange(e) {
        this.props.setTapeAndTime(parseInt(e.target.value), 0);
    }

    setVideoTime() {
        this.video.currentTime = this.props.videoTime;
    }

    setVideoStatus() {
        let isPlaying = this.video.currentTime > 0 && !this.video.paused && !this.video.ended && this.video.readyState > 2;
        this.props.videoStatus === 'play' && !isPlaying ? this.video.play() : this.video.pause();
    }

    reconnectVideoProgress() {
        this.props.handleTranscriptScroll(false);
        window.scrollTo(0, 1);
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
        switch (this.props.project) {
            case 'mog': {
                return `${this.props.interview.src_base}/${this.props.archiveId}/${this.props.archiveId}_0${this.props.interview.tape_count}_0${this.props.tape}_720p.mp4`
            }
            case 'zwar': {
                switch (this.props.interview.media_type) {
                    case 'video': {
                        return `${this.props.interview.src_base}/${this.props.archiveId.toUpperCase()}/${this.props.archiveId.toUpperCase()}_0${this.props.interview.tape_count}_0${this.props.tape}_720p.mp4`
                    }
                    case 'audio': {
                        return `${this.props.interview.src_base}/${this.props.archiveId.toUpperCase()}/${this.props.archiveId.toUpperCase()}_0${this.props.interview.tape_count}_0${this.props.tape}_256k.mp3`
                    }
                }
            }
            case 'hagen': {
                return `${this.props.interview.src_base}/${this.props.archiveId.toUpperCase()}_0${this.props.interview.tape_count}_0${this.props.tape}.mp3`
            }
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
                    getSegmentId(this.video.currentTime, segments(this.props), this.props.interview.last_segments_ids[this.props.tape], this.props.interview.first_segments_ids[this.props.tape])
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
                time: segment.start_time,
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
        // return this.props.locales.map((locale, index) => {
        return this.props.interview.languages.map((locale, index) => {
            return (
                <track 
                    key={`subtitle-${locale}`}
                    kind="subtitles"
                    label={t(this.props, locale)}
                    src={this.props.archiveId + '.vtt?lang=' + locale + '&tape_number=' + this.props.tape}
                    srcLang={locale}
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

    handleVideoClick(e) {
        if(this.video) {
            if(navigator.userAgent.indexOf("Chrome") != -1 )
            {
                this.video.paused ? this.video.play() : this.video.pause();
            }
            //else if(navigator.userAgent.indexOf("Safari") != -1)
            //{
            //}
            //else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
            //{
            //}
            //else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
            //{
            //}  
            //else 
            //{
            //}
        }
    }

    render() {
        if (this.props.project) {
            return (
                <div className='wrapper-video'>
                    <i className="fa fa-expand expand" aria-hidden="true" onClick={() => this.reconnectVideoProgress()} />
                    <div className={"video-title-container"}>
                        <h1 className='video-title'>
                            {fullname(this.props, this.props.interviewee, true)}
                        </h1>
                        <div className="video-icons-container">
                            <select value={this.props.tape} onChange={this.handleChange} className={this.props.interview.tape_count == 1 ? 'hidden tapeselector' : 'tapeselector'}>
                                {this.tapeSelector()}
                            </select>
                            {this.annotateOnSegmentLink()}
                            {this.rememberInterviewLink()}
                        </div>
                    </div>
                    <div className='video-element'>
                        <video 
                            id='video'
                            ref={(video) => {
                                this.video = video;
                            }}
                            onTimeUpdate={(event) => {
                                let time = Math.round(event.target.currentTime*100)/100;
                                if (time !== this.props.videoTime) {
                                    this.props.handleVideoTimeChange(time)
                                }
                            }}
                            onEnded={(event) => {
                            this.handleVideoEnded()
                            }}
                            playsInline={true}
                            controls={true}
                            controlsList="nodownload"
                            poster={this.props.interview.still_url || MISSING_STILL}
                            onClick={(e) => this.handleVideoClick(e)}
                            src={this.src()}
                        >
                        {this.subtitles()}
                        </video>
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
