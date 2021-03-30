import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getProjects, getRoles, getRolesStatus } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import UserRoleForm from './UserRoleForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    roles: getRoles(state),
    rolesStatus: getRolesStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleForm);
