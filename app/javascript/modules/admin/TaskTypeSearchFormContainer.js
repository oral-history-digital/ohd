import { connect } from 'react-redux';

import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getProjects, getTaskTypesStatus } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataSearchForm from './DataSearchForm';
import {  } from '../data';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: state.search.task_types.query,
    dataStatus: getTaskTypesStatus(state),
    scope: 'task_type',
    searchableAttributes: [
        {attributeName: 'label'},
    ],
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
