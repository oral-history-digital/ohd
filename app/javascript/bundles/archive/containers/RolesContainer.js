import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
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
        account: state.account,
        editView: state.archive.editView,
        data: state.data.roles,
        resultPagesCount: state.data.statuses.roles.resultPagesCount,
        query: state.search.roles.query,
        isDataSearching: state.search.isRoleSearching,
        scope: 'role',
        baseTabIndex: 10,
        detailsAttributes: ['desc', 'controller', 'action'],
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1} 
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
        ]
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
