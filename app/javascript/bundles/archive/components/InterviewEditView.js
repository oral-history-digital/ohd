import React from 'react';
import SegmentEditViewContainer from '../containers/SegmentEditViewContainer';
import { t, segments, sortedSegmentsWithActiveIndex, getInterviewee } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'
import {
    SEGMENTS_AFTER,
    SEGMENTS_BEFORE
} from '../constants/archiveConstants';

export default class InterviewEditView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadSegments();
        let currentSegment = sortedSegmentsWithActiveIndex(this.props.transcriptTime, this.props)[0];
        let activeSegmentElement = document.getElementById(`segment_${currentSegment && currentSegment.id}`);
        if (activeSegmentElement) {
            let offset = activeSegmentElement.offsetTop;
            if (offset > 450) {
                window.scrollTo(0, offset - 400);
            } else {
                window.scrollTo(0, 1);
            }
        }
    }

    componentDidUpdate() {
        this.loadSegments();
    }

    loadSegments() {
        if (
            !this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`]
        ) {
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'segments');
        }
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
              return <th key={`edit-column-header-${index}`}>{t(this.props, `edit_column_header.${column}`)}</th>
        })
        return <tr>{row}</tr>;
    }

    tableRows() {
        let rows = [];
        let translationLocale = this.props.interview.languages.filter(locale => locale !== this.props.interview.lang)[0]

        return sortedSegmentsWithActiveIndex(0, this.props)[1].map((segment, index) => {
            return (<SegmentEditViewContainer
                segment={segment}
                originalLocale={this.props.interview.lang}
                translationLocale={translationLocale}
                key={`segment-edit-view-${segment.id}`}
            />);
        })
    }

    render () {
        if (this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`] && this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched') {
            return (
                <table className='edit_interview'>
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
