import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { toggleFlyoutTabs, getFlyoutTabsVisible } from 'modules/flyout-tabs';
import { getEditView, getLocale, getProjectId } from 'modules/archive';
import { fetchData, deleteData, getCurrentAccount, getProjects } from 'modules/data';
import { getTranscriptScrollEnabled } from 'modules/video-player';
import { getIsLoggedIn, getIsLoggedOut, getLoggedInAt } from 'modules/account';
import WrapperPage from './WrapperPage';

const mapStateToProps = (state) => {
    return {
        projectId: getProjectId(state),
        projects: getProjects(state),
        projectsStatus: state.data.statuses.projects,
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
        locale: getLocale(state),
        visible: getFlyoutTabsVisible(state),
        loggedInAt: getLoggedInAt(state),
        collectionsStatus: state.data.statuses.collections,
        languagesStatus: state.data.statuses.languages,
        editView: getEditView(state),
        account: getCurrentAccount(state),
        accountsStatus: state.data.statuses.accounts,
        isLoggedIn: getIsLoggedIn(state),
        isLoggedOut: getIsLoggedOut(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    toggleFlyoutTabs,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(WrapperPage));
