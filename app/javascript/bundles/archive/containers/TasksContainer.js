import { connect } from 'react-redux';

import DataList from '../components/DataList';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        //
        //
        //
        scope: 'task',
        detailsAttributes: ['name', 'desc', 'workflow_state', 'authorized_id', 'authorized_type'],
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1} 
            },
            {
                attribute: 'desc',
                elementType: 'textarea',
                validate: function(v){return v.length > 1} 
            },
            {
                attribute: 'authorized_type',
                elementType: 'select',
                values: ['Interview', 'BiographicalEntry', 'RegistryReference', 'Contribution', 'Photo'],
                optionsScope: 'tasks',
                withEmpty: true,
                validate: function(v){return v !== ''} 
            },
            {
                attribute: 'authorized_id',
                validate: function(v){return v.length > 1} 
            },
            {
                attribute: 'workflow_state',
                elementType: 'select',
                optionsScope: 'workflow_states',
                withEmpty: true,
            },
        ]
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

