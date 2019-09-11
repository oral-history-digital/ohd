import { connect } from 'react-redux';

import DataList from '../components/DataList';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: getCookie('editView'),
        //
        //
        //
        joinDataStatus: state.data.statuses.permissions,
        joinDataScope: 'permissions',
        scope: 'role_permission',
        detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
        formElements: [
            {
                elementType: 'select',
                attribute: 'permission_id',
                values: state.data.permissions,
                withEmpty: true,
                validate: function(v){return v.length > 0} 
            }
        ],
        hideEdit: true
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
