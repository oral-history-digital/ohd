import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getProjectLocales, getProjects, getCollectionsForCurrentProject,
    getContributionTypesForCurrentProject, getPeopleForCurrentProject, getLanguages } from 'modules/data';
import InterviewForm from './InterviewForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    translations: getTranslations(state),
    collections: getCollectionsForCurrentProject(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
    people: getPeopleForCurrentProject(state),
    languages: getLanguages(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
