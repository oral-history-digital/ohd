import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getProjects, getPermissionsStatus } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: state.search.permissions.query,
    dataStatus: getPermissionsStatus(state),
    scope: 'permission',
    searchableAttributes: [
        {attributeName: 'name'},
        {attributeName: 'klass'},
        {attributeName: 'action_name'},
    ],
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
