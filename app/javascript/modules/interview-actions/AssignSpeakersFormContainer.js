import { getArchiveId, getProjectId } from 'modules/archive';
import {
    fetchData,
    getContributionTypesForCurrentProject,
    getCurrentProject,
    getSpeakerDesignationsStatus,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
