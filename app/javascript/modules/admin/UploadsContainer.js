import { connect } from 'react-redux';

import { submitData, getCurrentProject } from 'modules/data';
import Uploads from './Uploads';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        uploadTypes: project && project.upload_types,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        hasMap: project && project.has_map,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
