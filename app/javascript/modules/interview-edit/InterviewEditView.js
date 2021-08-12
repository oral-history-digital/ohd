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
        const { segmentsStatus, archiveId, fetchData } = this.props;

        if (!segmentsStatus[`for_interviews_${archiveId}`]) {
            fetchData(this.props, 'interviews', archiveId, 'segments');
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
        const { interview, selectedInterviewEditViewColumns } = this.props;

        let columns = selectedInterviewEditViewColumns.filter(v => permittedColumns(this.props, interview.id).includes(v))
        let row = columns.map((column, index) => {
            let className = column === 'timecode' ? 'small' : ''
            return <th className={className} key={`edit-column-header-${index}`}>{t(this.props, `edit_column_header.${column}`)}</th>
        })
        return <tr>{row}</tr>;
    }

    tableRows() {
        const { interview, project, locale, mediaTime, tape, skipEmptyRows } = this.props;

        let translationLocale = interview.languages.filter(locale => locale !== interview.lang)[0];
        //
        // use project.default_locale if no translation-locale given and if it differs from interview-language
        //
        //translationLocale ||= this.props.interview.lang === this.props.project.default_locale ?
            //this.props.project.available_locales.filter(locale => locale !== this.props.interview.lang)[0] :
            //this.props.project.default_locale;

        //
        // use interface-locale if no translation-locale given and if it differs from interview-language
        //
        translationLocale ||= interview.lang === locale ?
            project.available_locales.filter(locale => locale !== interview.lang)[0] :
            locale;

        let sortedWithIndex = sortedSegmentsWithActiveIndex(mediaTime, this.props);
        let shownSegments = []
        if (skipEmptyRows) {
            shownSegments = this.allFilledRows(sortedWithIndex);
        } else {
            shownSegments = this.shownSegmentsAround(sortedWithIndex);
        }
            return shownSegments.map((segment) => {
                let active = false;
                if (
                    segment.time <= mediaTime + 15 &&
                    segment.time >= mediaTime - 15 &&
                    segment.tape_nbr === tape
                ) {
                    active = true;
                }
                return (
                  <SegmentEditViewContainer
                    segment={segment}
                    originalLocale={interview.lang}
                    translationLocale={translationLocale}
                    key={segment.id}
                    active={active}
                />
            )
        })
    }

    render () {
        const { segmentsStatus, archiveId } = this.props;

        if (segmentsStatus[`for_interviews_${archiveId}`] && segmentsStatus[`for_interviews_${archiveId}`].split('-')[0] === 'fetched') {
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
