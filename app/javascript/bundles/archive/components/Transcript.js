import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';
import { t, segments, activeSegment, getInterviewee } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'
import {
    SEGMENTS_AFTER,
    SEGMENTS_BEFORE
} from '../constants/archiveConstants';

export default class Transcript extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.loadSegments();
        window.addEventListener('wheel', this.handleScroll);
        let currentSegment = activeSegment(this.props.transcriptTime, this.props);
        let activeSegmentElement = document.getElementById(`segment_${currentSegment && currentSegment.id}`);
        if (activeSegmentElement) {
            let offset = activeSegmentElement.offsetTop;
            if (offset > 450) {
                (window.innerHeight < 900) && this.handleScroll();
                this.props.transcriptScrollEnabled && window.scrollTo(0, offset - 400);
            } else {
                window.scrollTo(0, 1);
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll);
    }

    componentDidUpdate() {
        this.loadSegments();
    }

    loadSegments() {
        if (
            this.props.loadSegments &&
            !this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`]
        ) {
            this.props.fetchData('interviews', this.props.archiveId, 'segments');
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.transcriptScrollEnabled && this.props.transcriptScrollEnabled) {
            let currentSegment = activeSegment(this.props.transcriptTime, this.props);
            let activeSegmentElement = document.getElementById(`segment_${currentSegment && currentSegment.id}`);
            if (activeSegmentElement) {
                let offset = activeSegmentElement.offsetTop;
                if (offset > 450) {
                    (window.innerHeight < 900) && this.handleScroll();
                    window.scrollTo(0, offset - 400);
                } else {
                    window.scrollTo(0, 1);
                }
            }
        }
    }

    handleScroll() {
        if (!this.props.transcriptScrollEnabled) 
            this.props.handleTranscriptScroll(true)
    }

    shownSegmentsAround(segmentId) {
        if (segmentId > this.props.interview.last_segments_ids[this.props.tape] - SEGMENTS_AFTER)
            segmentId = this.props.interview.last_segments_ids[this.props.tape] - SEGMENTS_AFTER;

        if (segmentId < this.props.interview.first_segments_ids[this.props.tape] + SEGMENTS_BEFORE)
            segmentId = this.props.interview.first_segments_ids[this.props.tape] + SEGMENTS_BEFORE;

        let shownSegments = {};
        for (var i = -SEGMENTS_BEFORE; i < SEGMENTS_AFTER; i++) {
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
        let activeId = activeSegment(this.props.transcriptTime, this.props).id;
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
            let active = false;
            if (segment.time <= this.props.transcriptTime + 10 && segment.time >= this.props.transcriptTime - 5) {
                active = true;
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

