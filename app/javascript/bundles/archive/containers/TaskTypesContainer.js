import { connect } from 'react-redux';

import DataList from '../components/DataList';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData } from 'modules/data';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: true,
        //
        scope: 'task_type',
        detailsAttributes: [
            "key",
            "project_id",
        ],
        formElements: [
            {
                attribute: 'label',
                multiLocale: true,
            },
            {
                attribute: 'key',
            },
            {
                attribute: 'abbreviation',
                validate: function(v){return v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'use',
                type: 'checkbox',
            },
            {
                elementType: 'select',
                attribute: 'project_id',
                values: state.data.projects,
                withEmpty: true,
            },
        ],
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
