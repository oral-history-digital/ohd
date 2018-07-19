import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';
import { t, segments, getSegmentId } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class Transcript extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.loadSegments();
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        window.scrollTo(0, 1);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate() {
        this.loadSegments();
    }

    loadSegments() {
        if (
            this.props.loadSegments &&
            !this.props.interview.segment_status
        ) {
            this.props.fetchData('interviews', this.props.archiveId, 'segments');
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.transcriptScrollEnabled && this.props.transcriptScrollEnabled) {
            let activeSegment = document.getElementById(`segment_${getSegmentId(this.props.transcriptTime, segments(this.props), this.props.interview.last_segments_ids[this.props.tape], this.props.interview.first_segments_ids[this.props.tape])}`);
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

    shownSegmentsCount() {
        return 7;
    }

    shownSegmentsAround(segmentId) {
        if (segmentId > this.props.interview.last_segments_ids[this.props.tape] - this.shownSegmentsCount())
            segmentId = this.props.interview.last_segments_ids[this.props.tape] - this.shownSegmentsCount();

        let shownSegments = {};
        for (var i = 0; i < this.shownSegmentsCount(); i++) {
            shownSegments[segmentId + i] = segments(this.props)[segmentId + i];
        } 

        return shownSegments;
    }

    firstSegment() {
        return segments(this.props)[this.props.interview.first_segments_ids[this.props.tape]];
    }

    transcripted(locale) {
        return this.firstSegment() && this.firstSegment().transcripts.hasOwnProperty(locale);
    }

    transcript(){
        let shownSegments = this.props.transcriptScrollEnabled ? 
            segments(this.props) : 
            this.shownSegmentsAround(
                getSegmentId(this.props.transcriptTime, segments(this.props), this.props.interview.last_segments_ids[this.props.tape], this.props.interview.first_segments_ids[this.props.tape])
            );
        let speakerId;
        let transcript = [];

        for (var segmentId in shownSegments) {
            let segment = shownSegments[segmentId];
            segment.speaker_is_interviewee = this.props.interview.interviewee_id === segment.speaker_id;
            if (speakerId !== segment.speaker_id && segment.speaker_id !== null) {
                segment.speakerIdChanged = true;
                speakerId = segment.speaker_id;
            }
            transcript.push(
                <SegmentContainer
                    data={segment}
                    originalLocale={this.props.originalLocale}
                    key={"segment-" + segment.id}
                />
            )
        }
        return transcript;
    }

    render () {
        if (this.props.interview.segments_status === 'fetched') {
            if (this.props.originalLocale) {
                return this.transcripted(this.props.interview.lang) ? this.transcript() : t(this.props, 'without_transcript');
            } else {
                return this.transcripted(this.props.locale) ? this.transcript() : t(this.props, 'without_translation');
            }
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
    }
}

