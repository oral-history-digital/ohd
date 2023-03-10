import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getCurrentProject, getProjects, getProjectsStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = state => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    projects: getProjects(state),
    query: state.search.projects.query,
    dataStatus: getProjectsStatus(state),
    scope: 'project',
    searchableAttributes: [{ attributeName: 'name' }],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
