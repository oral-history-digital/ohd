import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';

export default class Transcript extends React.Component {

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.transcriptScrollEnabled && this.props.transcriptScrollEnabled) {
            let activeSegmentId = this.shownSegmentsFor(this.props.transcriptTime)[0].id;
            let activeSegment = document.getElementById(`segment_${activeSegmentId}`);
            if (activeSegment) {
                let hight = activeSegment.offsetTop - 400;
                window.scrollTo(0, hight);
            }
        }
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > 80);
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
        } else if (!fixVideo && this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(false)
        }
    }

    shownSegmentsFor(time) {
        let shownSegments = this.segments().filter( segment => {
            return (segment.tape_nbr === this.props.tape && segment.start_time >= (time - 10)) && (segment.end_time <= (time + 80));
        })
        return shownSegments;
    }

    segments() {
        return this.props.data && this.props.data.segments || [];
    }

    render () {
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
}

