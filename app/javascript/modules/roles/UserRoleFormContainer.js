import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    submitData,
    fetchData,
    getCurrentProject,
    getRolesForCurrentProject,
    getRolesStatus,
} from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import UserRoleForm from './UserRoleForm';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    roles: getRolesForCurrentProject(state),
    rolesStatus: getRolesStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleForm);
