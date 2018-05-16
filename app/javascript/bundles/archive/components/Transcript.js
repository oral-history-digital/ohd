import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';
import ArchiveUtils from "../../../lib/utils";

export default class Transcript extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }


    componentDidMount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        window.scrollTo(0, 1);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.transcriptScrollEnabled && this.props.transcriptScrollEnabled) {
            let activeSegmentId = this.shownSegmentsFor(this.props.transcriptTime)[0].id;
            let activeSegment = document.getElementById(`segment_${activeSegmentId}`);
            if (activeSegment) {
                let hight = activeSegment.offsetTop;
                if (hight > 450)
                    window.scrollTo(0, hight - 400);
            }
        }
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > $(".site-header").height());
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
        } else if (!fixVideo && this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(false)
        }
    }

    shownSegmentsFor(time) {
        let shownSegments = this.segments().filter( segment => {
            return (segment.tape_nbr === this.props.tape && segment.end_time >= time);
        })
        return shownSegments;
    }

    segments() {
        return this.props.data && this.props.data.segments || [];
    }

    translated() {
        return this.segments().length > 0 && this.segments()[0].transcripts.hasOwnProperty(this.props.locale)
    }

    transcript(){
        let shownSegments = this.props.transcriptScrollEnabled ? this.segments() : this.shownSegmentsFor(this.props.transcriptTime);
        let speakerId;

        return (
            <div>
                {shownSegments.map( (segment, index) => {
                    segment.speaker_is_interviewee = this.props.data.interview.interviewee_id === segment.speaker_id;
                    if (speakerId !== segment.speaker_id && segment.speaker_id !== null) {
                        segment.speakerIdChanged = true;
                        speakerId = segment.speaker_id;
                    }
                    return (
                        <SegmentContainer
                            data={segment}
                            originalLocale={this.props.originalLocale}
                            key={"segment-" + segment.id}
                        />
                    )
                })}
            </div>
        );
    }

    emptyTranscript() {
        if(this.props.translations !== undefined) {
            return ArchiveUtils.translate(this.props, 'without_translation');
        }
        return null;
    }

    render () {
        if (!this.translated() && !this.props.originalLocale){
            return this.emptyTranscript();
        } else {
            return this.transcript();
        }
    }
}

