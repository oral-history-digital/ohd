import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';

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

    userContentForm() {
        return <UserContentFormContainer
            title=''
            description=''
            properties={{title: this.props.interview.title}}
            reference_id={this.props.interview.id}
            reference_type='Interview'
            media_id={this.props.interview.archive_id}
            type='InterviewReference'
        />
    }


    render() {
        return (
            <div className='wrapper-video' onClick={() => this.reconnectVideoProgress()}>
                <div className={"video-title-container"}>
                    <h1 className='video-title'>{this.props.interview.short_title[this.props.locale]}</h1>
                    <div className="video-bookmark" onClick={() => this.props.openArchivePopup({
                        title: this.props.interview.short_title[this.props.locale] + " der Arbeitsmappe hinzufügen",
                        content: this.userContentForm()
                    })}><i className="fa fa-star"></i>
                        Interview merken
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
                               this.props.handleVideoEnded()
                           }}
                           controls={true}
                           poster={this.props.interview.still_url}
                    >
                        <source src={this.props.interview.src}/>
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
