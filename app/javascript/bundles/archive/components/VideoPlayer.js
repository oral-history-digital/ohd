import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import ArchiveUtils from '../../../lib/utils';
import moment from 'moment';

export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.fullscreenChange = this.fullscreenChange.bind(this);
        this.tracksVisible = false;
    }

    componentDidMount() {
        if (this.video) {
            this.video.addEventListener('webkitfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('mozfullscreenchange', this.fullscreenChange);
            this.video.addEventListener('fullscreenchange', this.fullscreenChange);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.video) {
            this.setVideoTime(prevProps)
            this.setVideoStatus(prevProps)
        }
    }

    setVideoTime(prevProps) {
        if (prevProps.videoTime !== this.props.videoTime) {
            this.video.currentTime = this.props.videoTime;
        }
    }

    setVideoStatus(prevProps) {
        if (prevProps.videoStatus !== this.props.videoStatus) {
            this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
        }
    }

    reconnectVideoProgress() {
        this.props.handleTranscriptScroll(false)
    }

    handleVideoEnded() {
        if (this.props.tape < this.props.interview.tape_count) {
            this.props.setNextVideo();
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
                switch (this.props.interview.video) {
                    case 'Video': {
                        return `${this.props.interview.src_base}/${this.props.archiveId.toUpperCase()}/${this.props.archiveId.toUpperCase()}_0${this.props.interview.tape_count}_0${this.props.tape}_720p.mp4`
                    }
                    case 'Audio': {
                        return `${this.props.interview.src_base}/${this.props.archiveId.toUpperCase()}/${this.props.archiveId.toUpperCase()}_0${this.props.interview.tape_count}_0${this.props.tape}_256k.mp3`
                    }
                }
            }
        }
    }

    rememberInterviewLink() {
        return <div className="video-bookmark" onClick={() => this.props.openArchivePopup({
            title: ArchiveUtils.translate(this.props, 'annotation_for_interview') + " " + this.props.interview.short_title[this.props.locale],
            content: this.rememberInterviewForm()
        })}>
            <i className="fa fa-star"></i>
            <span>{ArchiveUtils.translate(this.props, 'save_interview_reference')}</span>
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
            submitLabel={ArchiveUtils.translate(this.props, 'notice')}
        />
    }

    annotateOnSegmentLink() {
        return <div className="video-text-note" onClick={() => this.props.openArchivePopup({
            title: ArchiveUtils.translate(this.props, 'annotation_for'),
            content: this.annotateOnSegmentForm(this.actualSegmentIndex())
        })}>
            <i className="fa fa-pencil"></i>
            <span>{ArchiveUtils.translate(this.props, 'save_user_annotation')}</span>
        </div>
    }

    actualSegmentIndex() {
        return this.props.segments.findIndex(segment => {
            return segment.start_time <= this.video.currentTime && segment.end_time >= this.video.currentTime;
        })
    }

    annotateOnSegmentForm(segmentIndex) {
        let segment = this.props.segments[segmentIndex];

        return <UserContentFormContainer
            title={this.defaultTitle()}
            description=''
            properties={{
                time: segment.start_time,
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

    render() {

        let intervieweeNames = this.props.interviewee.names[this.props.locale];
        if (this.props.project) {
            return (
                <div className='wrapper-video' onClick={() => this.reconnectVideoProgress()}>
                    <div className={"video-title-container"}>
                        <h1 className='video-title'>
                            {intervieweeNames.firstname} {intervieweeNames.lastname} {intervieweeNames.birthname}
                        </h1>
                        <div className="video-icons-container">
                            {this.rememberInterviewLink()}
                            {this.annotateOnSegmentLink()}
                        </div>
                    </div>
                    <div className='video-element'>
                        <video ref={(video) => {
                            this.video = video;
                        }}
                               onTimeUpdate={(event) => {
                                   this.props.handleVideoTimeChange(event)
                               }}
                               onEnded={(event) => {
                                   this.handleVideoEnded()
                               }}
                               playsInline={true}
                               controls={true}
                               poster={this.props.interview.still_url}
                        >
                            <source src={this.src()}/>
                            <track kind="subtitles"
                                   label={ArchiveUtils.translate(this.props, 'transcript')}
                                   src={this.props.archiveId + '.vtt?type=transcript&tape_number=' + this.props.tape}
                                   srcLang="el"
                            />
                            <track kind="subtitles"
                                   label={ArchiveUtils.translate(this.props, 'translation')}
                                   src={this.props.archiveId + '.vtt?type=translation&tape_number=' + this.props.tape}
                                   srcLang="de"
                            />
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
    handleVideoTimeUpdate: React.PropTypes.func,
    handleVideoEnded: React.PropTypes.func,
};
