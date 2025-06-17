import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Virtuoso } from 'react-virtuoso';

import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { isSegmentActive } from 'modules/interview-helpers';
import {
    EDIT_TABLE_FILTER_ALL,
    EDIT_TABLE_FILTER_SOME,
    EDIT_TABLE_FILTER_HEADINGS,
    EDIT_TABLE_FILTER_REFERENCES,
    EDIT_TABLE_FILTER_ANNOTATIONS
} from '../constants';
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
    fetchData,
}) {
    useEffect(() => {
        if (!segmentsStatus[`for_interviews_${archiveId}`]) {
            fetchData({ locale, projectId, project }, 'interviews', archiveId, 'segments');
        }
    }, []);

    if (!segmentsStatus[`for_interviews_${archiveId}`] || segmentsStatus[`for_interviews_${archiveId}`].split('-')[0] !== 'fetched') {
        return <Spinner />;
    }

    const allSegments = sortedSegmentsWithActiveIndex(mediaTime, { interview, tape })[1];

    let segments;
    switch (filter) {
    case EDIT_TABLE_FILTER_SOME:
        segments = allSegments.filter(s => s.has_heading || s.annotations_count > 0 || s.registry_references_count > 0);
        break;
    case EDIT_TABLE_FILTER_HEADINGS:
        segments = allSegments.filter(s => s.has_heading);
        break;
    case EDIT_TABLE_FILTER_REFERENCES:
        segments = allSegments.filter(s => s.registry_references_count > 0);
        break;
    case EDIT_TABLE_FILTER_ANNOTATIONS:
        segments = allSegments.filter(s => s.annotations_count > 0);
        break;
    case EDIT_TABLE_FILTER_ALL:
    default:
        segments = allSegments;
        break;
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
                originalLocale={interview.alpha3}
                translationLocale={interview.translation_alpha3}
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
    project: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
