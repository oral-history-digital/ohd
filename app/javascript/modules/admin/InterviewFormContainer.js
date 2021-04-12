import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getProjects, getCollections, getContributionTypes,
    getPeople, getLanguages } from 'modules/data';
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
        collections: getCollections(state),
        contributionTypes: getContributionTypes(state),
        people: getPeople(state),
        languages: getLanguages(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
