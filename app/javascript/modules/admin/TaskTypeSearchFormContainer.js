import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getTaskTypesQuery } from 'modules/search';
import { fetchData, getProjects, getTaskTypesStatus } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: getTaskTypesQuery(state),
    dataStatus: getTaskTypesStatus(state),
    scope: 'task_type',
    searchableAttributes: [
        {attributeName: 'label'},
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
