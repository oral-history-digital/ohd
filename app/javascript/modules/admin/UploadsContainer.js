import { connect } from 'react-redux';

import { getLocale, getLocales, getTranslations, getEditView, getProjectId } from 'modules/archive';
import { submitData, getCurrentProject } from 'modules/data';
import Uploads from './Uploads';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        uploadTypes: project && project.upload_types,
        account: state.data.accounts.current,
        editView: getEditView(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        hasMap: project && project.has_map,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
