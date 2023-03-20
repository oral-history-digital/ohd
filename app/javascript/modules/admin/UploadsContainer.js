import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getEditView, getProjectId } from 'modules/archive';
import { submitData, getCurrentProject, getProjectLocales, getCurrentUser } from 'modules/data';
import Uploads from './Uploads';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: getProjectLocales(state),
        translations: getTranslations(state),
        uploadTypes: project && project.upload_types,
        user: getCurrentUser(state),
        editView: getEditView(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        hasMap: project && project.has_map,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
