import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
import RolePermissionsContainer from '../containers/RolePermissionsContainer';
import { 
    setQueryParams, 
} from '../actions/searchActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.roles,
        dataStatus: state.data.statuses.roles,
        resultPagesCount: state.data.statuses.roles.resultPagesCount,
        query: state.search.roles.query,
        scope: 'role',
        baseTabIndex: 6,
        detailsAttributes: ['name', 'desc'],
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1} 
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
        ],
        joinedData: {role_permission: RolePermissionsContainer},
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    deleteData: (dataType, id, nestedDataType, nestedId) => dispatch(deleteData(dataType, id, nestedDataType, nestedId)),
    submitData: (params, locale) => dispatch(submitData(params, locale)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
