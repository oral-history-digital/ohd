import { getEditView } from 'modules/archive';
import {
    deleteData,
    fetchData,
    getPermissions,
    getPermissionsStatus,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataList from './DataList';

const mapStateToProps = (state) => ({
    editView: getEditView(state),
    joinDataStatus: getPermissionsStatus(state),
    joinDataScope: 'permissions',
    scope: 'task_type_permission',
    detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
    formElements: [
        {
            elementType: 'select',
            attribute: 'permission_id',
            values: getPermissions(state),
            withEmpty: true,
            validate: (v) => v?.length > 0,
        },
    ],
    hideEdit: true,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
