import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Virtuoso } from 'react-virtuoso';

import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { isSegmentActive } from 'modules/interview-helpers';
import EditTableRowContainer from './EditTableRowContainer';
import EditTableHeaderContainer from './EditTableHeaderContainer';

export default function EditTable({
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

    const segments = sortedWithIndex[1];

    const content = index => {
        const segment = segments[index];
        const nextSegment = segments[index + 1];

        const active = isSegmentActive({
            thisSegmentTape: segment.tape_nbr,
            thisSegmentTime: segment.time,
            nextSegmentTape: nextSegment?.tape_nbr,
            nextSegmentTime: nextSegment?.time,
            currentTape: tape,
            currentTime: mediaTime,
        });

        return (
            <EditTableRowContainer
                key={segment.id}
                odd={index % 2 === 0}
                segment={segment}
                originalLocale={interview.lang}
                translationLocale={translationLocale}
                active={active}
            />
        );
    }

    return (
        <ScrollToTop>
            <div className="EditTable edit-interview__old">
                <EditTableHeaderContainer />
                <div className="EditTable-body">
                    <Virtuoso
                        totalCount={segments.length}
                        itemContent={content}
                        //fixedItemHeight={96}
                        useWindowScroll
                    />
                </div>
            </div>
        </ScrollToTop>
    );
}

EditTable.propTypes = {
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
