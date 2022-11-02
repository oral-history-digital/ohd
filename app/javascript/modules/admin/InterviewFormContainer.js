import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId, getProjectId } from 'modules/archive';
import {
    getCollectionsForCurrentProject,
    getContributionTypesForCurrentProject,
    getCurrentProject,
    getLanguages,
    getProjectLocales,
    getProjects,
    submitData,
} from 'modules/data';
import InterviewForm from './InterviewForm';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    collections: getCollectionsForCurrentProject(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
    languages: getLanguages(state),
    locales: getProjectLocales(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
