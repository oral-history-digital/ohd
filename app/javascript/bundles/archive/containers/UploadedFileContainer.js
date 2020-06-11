import { connect } from 'react-redux';

import DataList from '../components/DataList';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: true,
        //
        scope: 'uploaded_file',
        detailsAttributes: ['src', 'locale'],
        formElements: [
            {
                attribute: "locale",
                elementType: 'select',
                values: state.archive.locales,
                withEmpty: true,
                validate: function(v){return /\w{2}/.test(v)},
            },
            {
                attribute: 'file',
                elementType: 'input',
                type: 'file',
                //validate: function(v){return v instanceof File},
            },
            {
                attribute: 'href',
            },
            {
                attribute: 'title',
            },
            {
                attribute: 'type',
                hidden: true,
            },
            {
                attribute: 'ref_type',
                hidden: true,
            },
            {
                attribute: 'ref_id',
                hidden: true,
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

