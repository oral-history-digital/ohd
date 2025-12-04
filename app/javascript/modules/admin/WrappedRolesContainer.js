import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRolesForCurrentProject,
    getRolesStatus,
    submitData,
} from 'modules/data';
import { getRolesQuery, setQueryParams } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RolePermissionsContainer from './RolePermissionsContainer';
import WrappedDataList from './WrappedDataList';

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
        initialFormValues: { project_id: project.id },
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
                validate: function (v) {
                    return v?.length > 1;
                },
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
        ],
        joinedData: { role_permission: RolePermissionsContainer },
        helpTextCode: 'role_form',
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
            setQueryParams,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
