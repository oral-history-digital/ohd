import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSidebar, getSidebarVisible } from 'modules/sidebar';
import { getEditView, getLocale, setLocale, getProjectId } from 'modules/archive';
import { fetchData, getProjects, getCollectionsStatus,
    getLanguagesStatus, getProjectsStatus, getCurrentProject } from 'modules/data';
import { getLoggedInAt } from 'modules/account';
import Layout from './Layout';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    projectsStatus: getProjectsStatus(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
    sidebarVisible: getSidebarVisible(state),
    loggedInAt: getLoggedInAt(state),
    collectionsStatus: getCollectionsStatus(state),
    languagesStatus: getLanguagesStatus(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    toggleSidebar,
    setLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
