import React from 'react';
import SegmentEditViewContainer from '../containers/SegmentEditViewContainer';
import { t, segments, sortedSegmentsWithActiveIndex, getInterviewee } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class InterviewEditView extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.loadSegments();
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
                window.scrollTo(0, offset);
            }
        }
    }

    handleScroll() {
        // no scrolling in fullscreen - because this would remove the fixed table header
        if (!this.props.transcriptScrollEnabled && !document.getElementsByClassName('fullscreen')) {
            this.props.handleTranscriptScroll(true)
        }
    }

    shownSegmentsAround(sortedWithIndex) {
        const ROWS_BEFORE = 0;
        const ROWS_AFTER = 40;
        let start = sortedWithIndex[2] >= ROWS_BEFORE ? sortedWithIndex[2] - ROWS_BEFORE : 0
        let end = sortedWithIndex[2] + ROWS_AFTER
        return sortedWithIndex[1] ? sortedWithIndex[1].slice(start, end) : [];
    }

    tableHeader() {
      // where does the column header 'translations_attributes' come from? FIXME remove!
      let columns = this.props.selectedInterviewEditViewColumns
      let index = columns.indexOf('translations_attributes');
      if (index > -1) {
        columns.splice(index, 1);
      }
        let count = columns.size
        let row = columns.map((column, index) => {
              let className = column === 'timecode' ? 'small' : ''
              return <th className={className} key={`edit-column-header-${index}`}>{t(this.props, `edit_column_header.${column}`)}</th>
        })
        return <tr>{row}</tr>;
    }

    tableRows() {
        let translationLocale = this.props.interview.languages.filter(locale => locale !== this.props.interview.lang)[0]

        let sortedWithIndex = sortedSegmentsWithActiveIndex(this.props.transcriptTime, this.props);
        let shownSegments = this.props.transcriptScrollEnabled ?
            sortedWithIndex[1] :
            this.shownSegmentsAround(sortedWithIndex);


            return shownSegments.map((segment, index) => {

                let active = false;
                if (
                    segment.time <= this.props.transcriptTime + 15 &&
                    segment.time >= this.props.transcriptTime - 15 &&
                    segment.tape_nbr === this.props.tape
                ) {
                    active = true;
                }
                return (
                  <SegmentEditViewContainer
                    segment={segment}
                    originalLocale={this.props.interview.lang}
                    translationLocale={translationLocale}
                    key={`segment-${segment.id}`}
                    active={active}
                />
            )
        })
    }

    render () {
        if (this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`] && this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched') {
            return (
                <table className='edit-interview'>
                    <thead>
                        {this.tableHeader()}
                    </thead>
                    <tbody>
                        {this.tableRows()}
                    </tbody>
                </table>
          );
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
    }
}
