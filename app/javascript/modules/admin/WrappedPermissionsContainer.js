import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getPermissionsQuery } from 'modules/search';
import {
    fetchData,
    deleteData,
    submitData,
    getPermissions,
    getPermissionsStatus,
} from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => ({
    data: getPermissions(state),
    dataStatus: getPermissionsStatus(state),
    resultPagesCount: getPermissionsStatus(state).resultPagesCount,
    query: getPermissionsQuery(state),
    scope: 'permission',
    detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
    formElements: [
        {
            attribute: 'name',
            validate: function (v) {
                return v?.length > 1;
            },
        },
        {
            elementType: 'textarea',
            attribute: 'desc',
        },
        {
            attribute: 'klass',
            validate: function (v) {
                return v?.length > 1;
            },
        },
        {
            attribute: 'action_name',
            validate: function (v) {
                return v?.length > 1;
            },
        },
    ],
    helpTextCode: 'permission_form',
});

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
