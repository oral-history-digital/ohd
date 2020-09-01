import { connect } from 'react-redux';

import DataList from '../components/DataList';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        //
        // editView should always be true on tasks
        // because tasks can be seen only in the own account
        // or if editView == true in some user administration area
        //
        editView: true,
        //
        scope: 'task',
        detailsAttributes: ['name', 'archive_id', 'workflow_state'],
        formElements: [
            {
                attribute: 'task_type_id',
                elementType: 'select',
                values: state.data.task_types,
                withEmpty: true,
                validate: function(v){return /\d+/.test(v)} 
            },
            {
                attribute: 'archive_id',
                validate: function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)},
            },
            //{
                //attribute: 'interview_id',
                //elementType: 'select',
                //values: state.data.interviews,
                //withEmpty: true,
                //validate: function(v){return /^\d+$/.test(v)} 
            //},
            {
                attribute: 'workflow_state',
                elementType: 'select',
                values: ['start', 'finish', 'clear', 'restart'],
                optionsScope: 'workflow_states',
            },
        ]
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

