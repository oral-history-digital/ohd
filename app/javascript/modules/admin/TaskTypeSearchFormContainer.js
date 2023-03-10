import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getTaskTypesQuery } from 'modules/search';
import { fetchData, getCurrentProject, getTaskTypesStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
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
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
