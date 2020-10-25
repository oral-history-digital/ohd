import { connect } from 'react-redux';

import DataSearchForm from '../components/DataSearchForm';
import { 
    resetQuery, 
    setQueryParams, 
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        query: state.search.registry_reference_types.query,
        dataStatus: state.data.statuses.registry_reference_types,
        scope: 'registry_reference_type',
        searchableAttributes: [
            {attributeName: 'name'}, 
            {attributeName: 'code'}, 
        ]
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
