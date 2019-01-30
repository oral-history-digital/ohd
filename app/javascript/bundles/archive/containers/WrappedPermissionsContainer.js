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
        data: state.data.permissions,
        dataStatus: state.data.statuses.permissions,
        resultPagesCount: state.data.statuses.permissions.resultPagesCount,
        query: state.search.permissions.query,
        scope: 'permission',
        baseTabIndex: 11,
        detailsAttributes: ['name', 'desc', 'controller', 'action'],
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1} 
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
            {
                attribute: 'controller',
                validate: function(v){return v.length > 1} 
            },
            {
                attribute: 'action',
                validate: function(v){return v.length > 1} 
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
