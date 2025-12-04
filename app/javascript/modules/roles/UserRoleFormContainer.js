import { getLocale, getProjectId } from 'modules/archive';
import {
    fetchData,
    getCurrentProject,
    getRolesForCurrentProject,
    getRolesStatus,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
