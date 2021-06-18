import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { toggleFlyoutTabs, getFlyoutTabsVisible } from 'modules/flyout-tabs';
import { getEditView, getLocale, getProjectId } from 'modules/archive';
import { fetchData, deleteData, getCurrentAccount, getProjects, getCollectionsStatus,
    getLanguagesStatus, getAccountsStatus, getProjectsStatus, getCurrentProject } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut, getLoggedInAt } from 'modules/account';
import WrapperPage from './WrapperPage';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    projectsStatus: getProjectsStatus(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
    flyoutTabsVisible: getFlyoutTabsVisible(state),
    loggedInAt: getLoggedInAt(state),
    collectionsStatus: getCollectionsStatus(state),
    languagesStatus: getLanguagesStatus(state),
    editView: getEditView(state),
    account: getCurrentAccount(state),
    accountsStatus: getAccountsStatus(state),
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    toggleFlyoutTabs,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(WrapperPage));
