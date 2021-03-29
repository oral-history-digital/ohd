import { connect } from 'react-redux';

import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getProjects, getCollectionsStatus } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: state.search.collections.query,
    dataStatus: getCollectionsStatus(state),
    scope: 'collection',
    searchableAttributes: [
        {attributeName: 'name'},
    ],
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
