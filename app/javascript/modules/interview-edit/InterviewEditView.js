import { Component } from 'react';
import PropTypes from 'prop-types';

import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import SegmentEditViewContainer from './SegmentEditViewContainer';
import permittedColumns from './permittedColumns';

export default class InterviewEditView extends Component {
    componentDidMount() {
        this.loadSegments();
    }

    componentDidUpdate() {
        this.loadSegments();
    }

    loadSegments() {
        if (!this.props.segmentsStatus[`for_interviews_${this.props.archiveId}`]) {
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'segments');
        }
    }

    allFilledRows(sortedWithIndex) {
      return  sortedWithIndex[1].filter(s => { return s.has_heading || s.annotations_count > 0 || s.registry_references_count > 0; });
    }

    shownSegmentsAround(sortedWithIndex) {
        const ROWS_BEFORE = 1;
        const ROWS_AFTER = 40;
        let start = sortedWithIndex[2] >= ROWS_BEFORE ? sortedWithIndex[2] - ROWS_BEFORE : 0
        let end = sortedWithIndex[2] + ROWS_AFTER
        return sortedWithIndex[1] ? sortedWithIndex[1].slice(start, end) : [];
    }

    tableHeader() {
        let columns = this.props.selectedInterviewEditViewColumns.filter(v => permittedColumns(this.props, this.props.interview.id).includes(v))
        let row = columns.map((column, index) => {
            let className = column === 'timecode' ? 'small' : ''
            return <th className={className} key={`edit-column-header-${index}`}>{t(this.props, `edit_column_header.${column}`)}</th>
        })
        return <tr>{row}</tr>;
    }

    tableRows() {
        let translationLocale = this.props.interview.languages.filter(locale => locale !== this.props.interview.lang)[0]
        //
        // use project.default_locale if no translation-locale given and if it differs from interview-language
        //
        //translationLocale ||= this.props.interview.lang === this.props.project.default_locale ?
            //this.props.project.available_locales.filter(locale => locale !== this.props.interview.lang)[0] :
            //this.props.project.default_locale;

        //
        // use interface-locale if no translation-locale given and if it differs from interview-language
        //
        translationLocale ||= this.props.interview.lang === this.props.locale ?
            this.props.project.available_locales.filter(locale => locale !== this.props.interview.lang)[0] :
            this.props.locale;

        let sortedWithIndex = sortedSegmentsWithActiveIndex(this.props.mediaTime, this.props);
        let shownSegments = []
        if (this.props.skipEmptyRows) {
            shownSegments = this.allFilledRows(sortedWithIndex);
        } else {
            shownSegments = this.shownSegmentsAround(sortedWithIndex);
        }
            return shownSegments.map((segment) => {
                let active = false;
                if (
                    segment.time <= this.props.mediaTime + 15 &&
                    segment.time >= this.props.mediaTime - 15 &&
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
                <ScrollToTop>
                    <table className='edit-interview'>
                        <thead>
                            {this.tableHeader()}
                        </thead>
                        <tbody>
                            {this.tableRows()}
                        </tbody>
                    </table>
                </ScrollToTop>
          );
        } else {
            return <Spinner />;
        }
    }
}

InterviewEditView.propTypes = {
    archiveId: PropTypes.string.isRequired,
    segmentsStatus: PropTypes.object.isRequired,
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
    skipEmptyRows: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    tape: PropTypes.number.isRequired,
    fetchData: PropTypes.func.isRequired,
};
