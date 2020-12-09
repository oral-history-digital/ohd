import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';
import { t, sortedSegmentsWithActiveIndex, getInterviewee } from '../../../lib/utils';
import { segmentsForTape } from 'utils/segments';
import {
    SEGMENTS_AFTER,
    SEGMENTS_BEFORE
} from '../constants/archiveConstants';
import Spinner from './Spinner';

export default class Transcript extends React.Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.loadSegments();
        if (!this.props.userContentsStatus) {
            this.props.fetchData(this.props, 'user_contents');
        }
        window.addEventListener('wheel', this.handleScroll);
        this.scrollToActiveSegment();
    }

    componentDidUpdate(prevProps) {
        this.loadSegments();
        if (
            (!prevProps.transcriptScrollEnabled && this.props.transcriptScrollEnabled) ||
            prevProps.tape !== this.props.tape
        ) {
            this.scrollToActiveSegment();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll);
    }

    loadSegments() {
        if (
            this.props.loadSegments &&
            !this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`]
        ) {
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'segments');
        }
    }

    scrollToActiveSegment() {
        let currentSegment = sortedSegmentsWithActiveIndex(this.props.transcriptTime, this.props)[0];
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

    handleScroll() {
        if (!this.props.transcriptScrollEnabled)
            this.props.handleTranscriptScroll(true)
    }

    shownSegmentsAround(sortedWithIndex) {
        let start = sortedWithIndex[2] >= SEGMENTS_BEFORE ? sortedWithIndex[2] - SEGMENTS_BEFORE : 0
        let end = sortedWithIndex[2] + SEGMENTS_AFTER
        return sortedWithIndex[1] ? sortedWithIndex[1].slice(start, end) : [];
    }

    firstSegment() {
        const { interview, tape } = this.props;
        const segments = segmentsForTape(interview, tape);
        return segments[interview.first_segments_ids[tape]];
    }

    firstTranslationLocale() {
        return this.props.interview.languages.filter(l => l !== this.props.interview.lang)[0];
    }

    transcripted(locale) {
        let first = this.firstSegment();
        return first && (first.text.hasOwnProperty(locale) || first.text.hasOwnProperty(`${locale}-public`));
    }

    transcript(){
        let locale = this.props.originalLocale ? this.props.interview.lang : this.firstTranslationLocale();
        let tabIndex = this.props.originalLocale ? 0 : 1;
        let sortedWithIndex = sortedSegmentsWithActiveIndex(this.props.transcriptTime, this.props);
        let shownSegments = this.props.transcriptScrollEnabled ?
            sortedWithIndex[1] :
            this.shownSegmentsAround(sortedWithIndex);

        let speaker, speakerId;
        let transcript = [];

        return shownSegments.map((segment, index) => {
            let interviewee = getInterviewee(this.props);
            segment.speaker_is_interviewee = interviewee && interviewee.id === segment.speaker_id;
            if (
                (speakerId !== segment.speaker_id && segment.speaker_id !== null) ||
                (speaker !== segment.speaker && segment.speaker_id === null)
            ) {
                segment.speakerIdChanged = true;
                speakerId = segment.speaker_id;
                speaker = segment.speaker;
            }
            let active = false;
            if (
                segment.time <= this.props.transcriptTime + 15 &&
                segment.time >= this.props.transcriptTime - 15 &&
                segment.tape_nbr === this.props.tape
            ) {
                active = true;
            }
            return (
                <SegmentContainer
                    data={segment}
                    contentLocale={locale}
                    tabIndex={tabIndex}
                    active={active}
                    key={"segment-" + segment.id}
                />
            )
        })
    }

    render () {
        if (this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`] && this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched') {
            if (this.props.originalLocale) {
                return this.transcripted(this.props.interview.lang) ? this.transcript() : t(this.props, 'without_transcript');
            } else {
                //return this.transcripted(this.props.interview.lang) ? this.transcript() : t(this.props, 'without_translation');
                return this.transcripted(this.firstTranslationLocale()) ? this.transcript() : t(this.props, 'without_translation');
            }
        } else {
            return <Spinner />;
        }
    }
}
