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
        scope: 'metadata_field',
        detailsAttributes: [
            "name", 
            "use_as_facet",
            "use_in_results_table",
            "use_in_details_view",
            "display_on_landing_page",
            "ref_object_type",
            "source",
            "label",
        ],
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1} 
            },
            {
                elementType: 'input',
                attribute: 'use_as_facet',
                type: 'checkbox',
            },
            {
                elementType: 'input',
                attribute: 'use_in_results_table',
                type: 'checkbox',
            },
            {
                elementType: 'input',
                attribute: 'use_in_details_view',
                type: 'checkbox',
            },
            {
                elementType: 'input',
                attribute: 'display_on_landing_page',
                type: 'checkbox',
            },
            {
                attribute: 'ref_object_type',
            },
            {
                attribute: 'source',
            },
            {
                attribute: 'label',
                elementType: 'multiLocaleInput',
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

