import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import SegmentEditViewContainer from './SegmentEditViewContainer';
import TableHeaderContainer from './TableHeaderContainer';

export default function InterviewEditView({
    interview,
    project,
    locale,
    mediaTime,
    tape,
    skipEmptyRows,
    segmentsStatus,
    archiveId,
    projectId,
    projects,
    fetchData,
}) {
    useEffect(() => {
        if (!segmentsStatus[`for_interviews_${archiveId}`]) {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'segments');
        }
    }, []);

    function allFilledRows(sortedWithIndex) {
        return sortedWithIndex[1].filter(
            s => s.has_heading || s.annotations_count > 0 || s.registry_references_count > 0
        );
    }

    function shownSegmentsAround(sortedWithIndex) {
        const ROWS_BEFORE = 1;
        const ROWS_AFTER = 40;
        let start = sortedWithIndex[2] >= ROWS_BEFORE ? sortedWithIndex[2] - ROWS_BEFORE : 0
        let end = sortedWithIndex[2] + ROWS_AFTER
        return sortedWithIndex[1] ? sortedWithIndex[1].slice(start, end) : [];
    }

    if (!segmentsStatus[`for_interviews_${archiveId}`] || segmentsStatus[`for_interviews_${archiveId}`].split('-')[0] !== 'fetched') {
        return <Spinner />;
    }

    let translationLocale = interview.languages.filter(locale => locale !== interview.lang)[0];
    //
    // use interface-locale if no translation-locale given and if it differs from interview-language
    //
    translationLocale ||= interview.lang === locale ?
        project.available_locales.filter(locale => locale !== interview.lang)[0] :
        locale;

    const sortedWithIndex = sortedSegmentsWithActiveIndex(mediaTime, { interview, tape });
    let shownSegments = [];
    if (skipEmptyRows) {
        shownSegments = allFilledRows(sortedWithIndex);
    } else {
        shownSegments = shownSegmentsAround(sortedWithIndex);
    }

    return (
        <ScrollToTop>
            <table className="edit-interview">
                <TableHeaderContainer />
                <tbody>
                    {
                        shownSegments.map(segment => {
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
                            );
                        })
                    }
                </tbody>
            </table>
        </ScrollToTop>
    );
}

InterviewEditView.propTypes = {
    archiveId: PropTypes.string.isRequired,
    segmentsStatus: PropTypes.object.isRequired,
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
