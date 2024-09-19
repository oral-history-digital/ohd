import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getRolesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject,
    getRolesForCurrentProject, getRolesStatus } from 'modules/data';
import WrappedDataList from './WrappedDataList';
import RolePermissionsContainer from './RolePermissionsContainer';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: getRolesForCurrentProject(state),
        dataStatus: getRolesStatus(state),
        resultPagesCount: getRolesStatus(state).resultPagesCount,
        query: getRolesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'role',
        detailsAttributes: ['name', 'desc'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v?.length > 1}
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
        ],
        joinedData: {role_permission: RolePermissionsContainer},
        helpTextCode: 'role_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
