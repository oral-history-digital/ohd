import { useMemo } from 'react';

import { getArchiveId } from 'modules/archive';
import {
    FetchProjectResource,
    fetchData,
    getContributionTypesForCurrentProject,
    getSpeakerDesignationsStatus,
    submitData,
} from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import AssignSpeakersForm from './AssignSpeakersForm';

/**
 * Loads contribution types and supplies speaker-assignment data and existing Redux actions.
 *
 * @param {Object} props - Interview and speaker-assignment form options.
 * @returns {React.ReactElement} Speaker editor or resource loading indicator.
 */
export default function AssignSpeakersFormContainer(props) {
    const archiveId = useSelector(getArchiveId);
    const contributionTypes = useSelector(
        getContributionTypesForCurrentProject
    );
    const speakerDesignationsStatus = useSelector(getSpeakerDesignationsStatus);
    const dispatch = useDispatch();
    const actions = useMemo(
        () => bindActionCreators({ fetchData, submitData }, dispatch),
        [dispatch]
    );
    return (
        <FetchProjectResource resource="contribution_types">
            <AssignSpeakersForm
                {...props}
                {...actions}
                archiveId={archiveId}
                contributionTypes={contributionTypes}
                speakerDesignationsStatus={speakerDesignationsStatus}
            />
        </FetchProjectResource>
    );
}
