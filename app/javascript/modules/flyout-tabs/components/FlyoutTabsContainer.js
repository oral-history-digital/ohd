import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { setLocale, getLocale, getArchiveId, getProjectId, getSelectedArchiveIds,
    getEditView, getTranslations, getCountryKeys } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewee, getCurrentProject, getProjects,
    getCurrentAccount, getProjectLocales } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import { setFlyoutTabsIndex } from '../actions';
import { getFlyoutTabsVisible, getFlyoutTabsIndex } from '../selectors';
import FlyoutTabs from './FlyoutTabs';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        flyoutTabsIndex: getFlyoutTabsIndex(state),
        visible: getFlyoutTabsVisible(state),
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
        selectedArchiveIds: getSelectedArchiveIds(state),
        locale: getLocale(state),
        locales: getProjectLocales(state),
        hasMap: project && project.has_map === 1,
        editView: getEditView(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        isLoggedIn: getIsLoggedIn(state),
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        countryKeys: getCountryKeys(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setLocale,
    setFlyoutTabsIndex,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FlyoutTabs));
