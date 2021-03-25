import { connect } from 'react-redux';

import { getLocale, getLocales, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject } from 'modules/data';
import InterviewForm from './InterviewForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        project: project,
        translations: getTranslations(state),
        collections: state.data.collections,
        contributionTypes: state.data.contribution_types,
        people: state.data.people,
        languages: state.data.languages,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params))
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
