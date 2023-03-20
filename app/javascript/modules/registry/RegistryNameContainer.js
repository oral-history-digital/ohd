import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, deleteData, getCurrentUser, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import RegistryName from './RegistryName';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryName);
