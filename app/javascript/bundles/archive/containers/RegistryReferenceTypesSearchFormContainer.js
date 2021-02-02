import { connect } from 'react-redux';

import DataSearchForm from '../components/DataSearchForm';
import {
    resetQuery,
    setQueryParams,
} from 'modules/search';
import { fetchData } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
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
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
