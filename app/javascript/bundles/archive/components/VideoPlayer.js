import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import ArchiveUtils from '../../../lib/utils';
import moment from 'moment';

export default class VideoPlayer extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (this.video) {
            this.setVideoTime(prevProps)
            this.setVideoStatus(prevProps)
        }
    }

    setVideoTime(prevProps) {
        if (prevProps.time !== this.props.videoTime) {
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
        return `${this.props.interview.src_base}/${this.props.archiveId}/${this.props.archiveId}_0${this.props.interview.tape_count}_0${this.props.tape}_720p.mp4`
    }

    userContentForm() {
        moment.locale(this.props.locale);
        let now = moment().format('lll');
        let title = `${this.props.archiveId} - ${this.props.interview.short_title[this.props.locale]} - ${now}`;

        return <UserContentFormContainer
            title={title}
            description=''
            properties={{title: this.props.interview.title}}
            reference_id={this.props.interview.id}
            reference_type='Interview'
            media_id={this.props.interview.archive_id}
            type='InterviewReference'
            submitLabel={ArchiveUtils.translate(this.props, 'notice')}
        />
    }


    render() {
        return (
            <div className='wrapper-video' onClick={() => this.reconnectVideoProgress()}>
                <div className={"video-title-container"}>
                    <h1 className='video-title'>{this.props.interviewee.names[this.props.locale].firstname} {this.props.interviewee.names[this.props.locale].lastname} {this.props.interviewee.names[this.props.locale].birthname}</h1>
                    <div className="video-bookmark" onClick={() => this.props.openArchivePopup({
                        title: ArchiveUtils.translate( this.props, 'annotation_for') + " " + this.props.interview.short_title[this.props.locale],
                        content: this.userContentForm()
                    })}><i className="fa fa-star"></i>
                        <span>Interview merken</span>
                    </div>
                    <div className="video-text-note"><i className="fa fa-pencil"></i><span>Anmerkung verfassen</span></div>
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
                           controls={true}
                           poster={this.props.interview.still_url}
                    >
                        <source src={this.src()}/>
                        <track kind="subtitles" label="Transcript"
                               src={this.props.archiveId + '.vtt?type=transcript'} srcLang="de" ></track>
                        <track kind="subtitles" label="Translation"
                               src={this.props.archiveId + '.vtt?type=translation'} srcLang="en"></track>
                    </video>
                </div>
            </div>
        );
    }
}

VideoPlayer.propTypes = {
    handleVideoTimeUpdate: React.PropTypes.func,
    handleVideoEnded: React.PropTypes.func,
};
