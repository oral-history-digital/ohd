import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';

export default class Transcript extends React.Component {

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > 80);
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
        } else if (!fixVideo && this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(false)
        }
    }

    showSegmentsFor(time) {
        let shownSegments = this.segments().filter( segment => {
            return (segment.tape_nbr === this.props.tape && segment.start_time >= (time - 10)) && (segment.end_time <= (time + 80));
        })
        return shownSegments;
    }

    segments() {
        return this.props.data && this.props.data.segments || [];
    }

    render () {
        let shownSegments = this.props.transcriptScrollEnabled ? this.segments() : this.showSegmentsFor(this.props.transcriptTime);
        let speakerId;

        return ( 
            <div>
                {shownSegments.map( (segment, index) => {
                    segment.speaker_is_interviewee = this.props.data.interview.interviewee_id === segment.speaker_id;
                    if (speakerId !== segment.speaker_id) {
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

