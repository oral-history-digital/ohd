import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import UserRoleForm from './UserRoleForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    roles: state.data.roles,
    rolesStatus: state.data.statuses.roles,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleForm);
