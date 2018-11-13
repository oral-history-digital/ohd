import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';
import { t, segments, getSegmentId, activeSegmentId, getInterviewee } from '../../../lib/utils';
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
            !this.props.segmentsStatus[this.props.archiveId]
        ) {
            this.props.fetchData('interviews', this.props.archiveId, 'segments');
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.transcriptScrollEnabled && this.props.transcriptScrollEnabled) {
            let activeSegment = document.getElementById(`segment_${activeSegmentId(this.props)}`);
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
        return 20;
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
        return this.firstSegment() && this.firstSegment().text.hasOwnProperty(locale);
    }

    transcript(){
        let activeId = activeSegmentId(this.props);
        let shownSegments = this.props.transcriptScrollEnabled ?
            segments(this.props) :
            this.shownSegmentsAround(activeId);

        let speakerId;
        let transcript = [];

        for (var segmentId in shownSegments) {
            let segment = shownSegments[segmentId];
            let interviewee = getInterviewee(this.props);
            segment.speaker_is_interviewee = interviewee && interviewee.id === segment.speaker_id;
            if (speakerId !== segment.speaker_id && segment.speaker_id !== null) {
                segment.speakerIdChanged = true;
                speakerId = segment.speaker_id;
            }
            transcript.push(
                <SegmentContainer
                    data={segment}
                    originalLocale={this.props.originalLocale}
                    active={parseInt(segmentId) === activeId}
                    key={"segment-" + segment.id}
                />
            )
        }
        return transcript;
    }

    render () {
        if (this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`] && this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched') {
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

