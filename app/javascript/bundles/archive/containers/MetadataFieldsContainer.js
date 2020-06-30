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
        joinDataStatus: state.data.statuses.registry_reference_types,
        joinDataScope: 'registry_reference_types',
        detailsAttributes: [
            "name", 
            "use_as_facet",
            "use_in_results_table",
            "use_in_details_view",
            "use_in_map_search",
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
                attribute: 'label',
                elementType: 'multiLocaleInput',
            },
            {
                elementType: 'input',
                attribute: 'use_as_facet',
                type: 'checkbox',
            },
            {
                elementType: 'input',
                attribute: 'facet_order',
                validate: function(v){return /\d+\.*\d*/.test(v)} 
            },
            {
                elementType: 'input',
                attribute: 'use_in_results_table',
                type: 'checkbox',
            },
            {
                elementType: 'input',
                attribute: 'list_columns_order',
                validate: function(v){return /\d+\.*\d*/.test(v)} 
            },
            {
                elementType: 'input',
                attribute: 'use_in_details_view',
                type: 'checkbox',
            },
            {
                elementType: 'input',
                attribute: 'use_in_map_search',
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
                elementType: 'select',
                attribute: 'registry_reference_type_id',
                values: state.data.registry_reference_types,
                withEmpty: true,
                //validate: function(v){return v.length > 0} 
            },
            {
                elementType: 'input',
                attribute: 'registry_entry_id',
                //validate: function(v){return /\d+/.test(v)} 
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

