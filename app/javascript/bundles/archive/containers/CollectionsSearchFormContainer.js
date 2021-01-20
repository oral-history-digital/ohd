import { connect } from 'react-redux';

import DataSearchForm from '../components/DataSearchForm';
import {
    resetQuery,
    setQueryParams,
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { hideFlyoutTabs } from 'modules/flyout-tabs';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        query: state.search.collections.query,
        dataStatus: state.data.statuses.collections,
        scope: 'collection',
        searchableAttributes: [
            {attributeName: 'name'},
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
