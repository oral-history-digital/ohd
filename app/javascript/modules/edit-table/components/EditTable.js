import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Virtuoso } from 'react-virtuoso';

import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { isSegmentActive } from 'modules/interview-helpers';
import { EDIT_TABLE_FILTER_FILTERED } from '../constants';
import EditTableRowContainer from './EditTableRowContainer';
import EditTableHeaderContainer from './EditTableHeaderContainer';

export default function EditTable({
    interview,
    project,
    locale,
    mediaTime,
    tape,
    filter,
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

    const allSegments = sortedSegmentsWithActiveIndex(mediaTime, { interview, tape })[1];

    let segments;
    if (filter === EDIT_TABLE_FILTER_FILTERED) {
        segments = allSegments.filter(s => s.has_heading || s.annotations_count > 0 || s.registry_references_count > 0);
    } else {
        segments = allSegments;
    }

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
                segment={segment}
                originalLocale={interview.lang}
                translationLocale={translationLocale}
                active={active}
            />
        );
    }

    return (
        <ScrollToTop>
            <div className="EditTable">
                <div className="EditTable-inner">
                    <EditTableHeaderContainer numElements={segments.length} />
                    <div className="EditTable-bodyContainer">
                        <div className="EditTable-body">
                            <Virtuoso
                                totalCount={segments.length}
                                itemContent={content}
                                fixedItemHeight={96}
                                useWindowScroll
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ScrollToTop>
    );
}

EditTable.propTypes = {
    archiveId: PropTypes.string.isRequired,
    segmentsStatus: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    tape: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
