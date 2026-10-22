import { useEffect } from 'react';

import { useI18n } from 'modules/i18n';
import { isSegmentActive } from 'modules/interview-helpers';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { InlineNotification } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import PropTypes from 'prop-types';
import { Virtuoso } from 'react-virtuoso';

import {
    EDIT_TABLE_FILTER_ALL,
    EDIT_TABLE_FILTER_ANNOTATIONS,
    EDIT_TABLE_FILTER_HEADINGS,
    EDIT_TABLE_FILTER_REFERENCES,
    EDIT_TABLE_FILTER_SOME,
} from '../constants';
import EditTableHeaderContainer from './EditTableHeaderContainer';
import EditTableRowContainer from './EditTableRowContainer';

/**
 * Displays editable interview segments with project-aware columns and route-based loading.
 * @param {Object} props - Interview, segment statuses, filters, playback position, and fetch action.
 * @returns {React.ReactElement} Segment editing table or loading/error state.
 */
export default function EditTable({
    interview,
    mediaTime,
    tape,
    filter,
    segmentsStatus,
    archiveId,
    fetchData,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();
    const { project, isLoading, error } = useProject();
    useEffect(() => {
        if (!segmentsStatus[`for_interviews_${archiveId}`]) {
            fetchData({ pathBase }, 'interviews', archiveId, 'segments');
        }
    }, [archiveId, fetchData, pathBase, segmentsStatus]);

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner />;
    if (
        !segmentsStatus[`for_interviews_${archiveId}`] ||
        segmentsStatus[`for_interviews_${archiveId}`].split('-')[0] !==
            'fetched'
    ) {
        return <Spinner />;
    }

    const allSegments = sortedSegmentsWithActiveIndex(mediaTime, {
        interview,
        tape,
    })[1];

    let segments;
    switch (filter) {
        case EDIT_TABLE_FILTER_SOME:
            segments = allSegments.filter(
                (s) =>
                    s.has_heading ||
                    s.annotations_count > 0 ||
                    s.registry_references_count > 0
            );
            break;
        case EDIT_TABLE_FILTER_HEADINGS:
            segments = allSegments.filter((s) => s.has_heading);
            break;
        case EDIT_TABLE_FILTER_REFERENCES:
            segments = allSegments.filter(
                (s) => s.registry_references_count > 0
            );
            break;
        case EDIT_TABLE_FILTER_ANNOTATIONS:
            segments = allSegments.filter((s) => s.annotations_count > 0);
            break;
        case EDIT_TABLE_FILTER_ALL:
        default:
            segments = allSegments;
            break;
    }

    const content = (index) => {
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
    };

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
    mediaTime: PropTypes.number.isRequired,
    tape: PropTypes.number.isRequired,
    fetchData: PropTypes.func.isRequired,
};
