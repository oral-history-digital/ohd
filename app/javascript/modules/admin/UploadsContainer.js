import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getEditView, getProjectId } from 'modules/archive';
import { submitData, getCurrentProject, getProjectLocales, getCurrentAccount, getProjects } from 'modules/data';
import Uploads from './Uploads';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: getProjectLocales(state),
        translations: getTranslations(state),
        uploadTypes: project && project.upload_types,
        account: getCurrentAccount(state),
        editView: getEditView(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
        hasMap: project && project.has_map,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
