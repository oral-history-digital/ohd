import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId, getProjectId } from 'modules/archive';
import {
    fetchData,
    getContributionTypesForCurrentProject,
    getSpeakerDesignationsStatus,
    submitData,
    getCurrentProject,
} from 'modules/data';
import AssignSpeakersForm from './AssignSpeakersForm';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    speakerDesignationsStatus: getSpeakerDesignationsStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);
