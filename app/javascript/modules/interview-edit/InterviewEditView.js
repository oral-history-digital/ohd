import { Component } from 'react';
import PropTypes from 'prop-types';

import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import SegmentEditViewContainer from './SegmentEditViewContainer';
import TableHeaderContainer from './TableHeaderContainer';

export default class InterviewEditView extends Component {
    componentDidMount() {
        this.loadSegments();
    }

    componentDidUpdate() {
        this.loadSegments();
    }

    loadSegments() {
        const { segmentsStatus, archiveId, locale, projectId, projects, fetchData } = this.props;

        if (!segmentsStatus[`for_interviews_${archiveId}`]) {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'segments');
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

    tableRows() {
        const { interview, project, locale, mediaTime, tape, skipEmptyRows } = this.props;

        let translationLocale = interview.languages.filter(locale => locale !== interview.lang)[0];
        //
        // use interface-locale if no translation-locale given and if it differs from interview-language
        //
        translationLocale ||= interview.lang === locale ?
            project.available_locales.filter(locale => locale !== interview.lang)[0] :
            locale;

        let sortedWithIndex = sortedSegmentsWithActiveIndex(mediaTime, { interview, tape });
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
                    <table className="edit-interview">
                        <TableHeaderContainer />
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
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
