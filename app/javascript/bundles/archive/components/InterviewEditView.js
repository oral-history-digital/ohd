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
        let row = this.props.selectedInterviewEditViewColumns.map((column, index) => {
            return <th className='box' key={`edit-column-header-${index}`}>{t(this.props, `edit_column_header.${column}`)}</th>
        })
        return <tr>{row}</tr>;
    }

    tableRows() {
        let rows = [];
        let shownSegments = segments(this.props);
        let translationLocale = this.props.interview.languages.filter(locale => locale !== this.props.interview.lang)[0]

        for (var segmentId in shownSegments) {
            let segment = shownSegments[segmentId];
            rows.push(<SegmentEditViewContainer 
                segment={segment} 
                originalLocale={this.props.interview.lang}
                translationLocale={translationLocale}
                key={`segment-edit-view-${segmentId}`} 
            />);
        }
        return rows;
    }

    render () {
        if (this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`] && this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched') {
            return (
                <table>
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

