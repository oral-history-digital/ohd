import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setLocale, getLocale, getArchiveId, getProjectId, getSelectedArchiveIds,
    getLocales, getEditView, getTranslations, getCountryKeys } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewee, getCurrentProject } from 'modules/data';
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
        projects: state.data.projects,
        project: project,
        selectedArchiveIds: getSelectedArchiveIds(state),
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        hasMap: project && project.has_map === 1,
        editView: getEditView(state),
        translations: getTranslations(state),
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        countryKeys: getCountryKeys(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    setLocale: locale => dispatch(setLocale(locale)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FlyoutTabs));
