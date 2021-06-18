import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getProjects, getCollectionsForCurrentProject, getContributionTypesForCurrentProject,
    getPeopleForCurrentProject, getLanguages } from 'modules/data';
import InterviewForm from './InterviewForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: project,
        translations: getTranslations(state),
        collections: getCollectionsForCurrentProject(state),
        contributionTypes: getContributionTypesForCurrentProject(state),
        people: getPeopleForCurrentProject(state),
        languages: getLanguages(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
