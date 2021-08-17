import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getEditView, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { deleteData, getCurrentAccount, getCurrentProject, getProjects } from 'modules/data';
import UserRole from './UserRole';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRole);
