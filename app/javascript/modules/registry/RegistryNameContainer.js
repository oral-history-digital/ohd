import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, deleteData, getProjects, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import RegistryName from './RegistryName';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryName);
