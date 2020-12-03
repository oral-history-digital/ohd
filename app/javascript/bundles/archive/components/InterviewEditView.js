import React from 'react';
import SegmentEditViewContainer from '../containers/SegmentEditViewContainer';
import { t, sortedSegmentsWithActiveIndex, permittedInterviewEditColumns } from '../../../lib/utils';
import Spinner from './Spinner';

export default class InterviewEditView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadSegments();
        window.scrollTo(0, 1);
    }

    componentDidUpdate(prevProps) {
        this.loadSegments();
    }

    loadSegments() {
        if (!this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`]) {
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'segments');
        }
    }

    allFilledRows(sortedWithIndex) {
      return  sortedWithIndex[1].filter(s => { return s.has_heading || s.annotations_total_count > 0 || s.references_total_count > 0; });
    }

    shownSegmentsAround(sortedWithIndex) {
        const ROWS_BEFORE = 1;
        const ROWS_AFTER = 40;
        let start = sortedWithIndex[2] >= ROWS_BEFORE ? sortedWithIndex[2] - ROWS_BEFORE : 0
        let end = sortedWithIndex[2] + ROWS_AFTER
        return sortedWithIndex[1] ? sortedWithIndex[1].slice(start, end) : [];
    }

    tableHeader() {
        let columns = this.props.selectedInterviewEditViewColumns.filter(v => permittedInterviewEditColumns(this.props, this.props.interview.id).includes(v))
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
        let shownSegments = []
        if (this.props.skipEmptyRows) {
            shownSegments = this.allFilledRows(sortedWithIndex);
        } else {
            shownSegments = this.shownSegmentsAround(sortedWithIndex);
        }
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
                    translationLocale={translationLocale || this.props.locale}
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
            return <Spinner />;
        }
    }
}
