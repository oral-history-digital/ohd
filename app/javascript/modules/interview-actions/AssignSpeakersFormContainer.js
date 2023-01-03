import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId, getProjectId } from 'modules/archive';
import {
    fetchData,
    getContributionTypesForCurrentProject,
    getCurrentProject,
    getProjects,
    getSpeakerDesignationsStatus,
    submitData,
} from 'modules/data';
import AssignSpeakersForm from './AssignSpeakersForm';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    speakerDesignationsStatus: getSpeakerDesignationsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);
