import { connect } from 'react-redux';

import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: state.archive.translations,
    locale: state.archive.locale,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    query: state.search.roles.query,
    dataStatus: state.data.statuses.roles,
    scope: 'role',
    searchableAttributes: [
        {attributeName: 'name'},
        {attributeName: 'desc'},
    ],
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);