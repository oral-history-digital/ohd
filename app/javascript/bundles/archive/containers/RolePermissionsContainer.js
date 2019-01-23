import { connect } from 'react-redux';

import DataList from '../components/DataList';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.account,
        editView: state.archive.editView,
        //data: state.data.permissions,
        joinDataStatus: state.data.statuses.permissions,
        joinDataScope: 'permissions',
        scope: 'role_permission',
        detailsAttributes: ['name', 'desc', 'controller', 'action'],
        formElements: [
            {
                elementType: 'select',
                attribute: 'permission_id',
                values: state.data.permissions,
                withEmpty: true,
                validate: function(v){return v.length > 0} 
            }
        ],
        ensureLoaded: 'permissions'
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    deleteData: (dataType, id, nestedDataType, nestedId) => dispatch(deleteData(dataType, id, nestedDataType, nestedId)),
    submitData: (params, locale) => dispatch(submitData(params, locale)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
