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
        query: state.search.permissions.query,
        dataStatus: state.data.statuses.permissions,
        isDataSearching: state.search.isPermissionsSearching,
        scope: 'permission',
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
