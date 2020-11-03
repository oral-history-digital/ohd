import { connect } from 'react-redux';

import DataSearchForm from '../components/DataSearchForm';
import {
    resetQuery,
    setQueryParams,
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        query: state.search.languages.query,
        dataStatus: state.data.statuses.languages,
        scope: 'language',
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
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
