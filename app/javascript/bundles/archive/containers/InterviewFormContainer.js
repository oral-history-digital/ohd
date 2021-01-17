import { connect } from 'react-redux';

import InterviewForm from '../components/InterviewForm';
import { submitData } from '../actions/dataActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        project: project,
        translations: state.archive.translations,
        collections: state.data.collections,
        people: state.data.people,
        languages: state.data.languages,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params))
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
