import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { openArchivePopup } from 'modules/ui';
import { setLocale } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewee, getCurrentProject } from 'modules/data';
import { setFlyoutTabsIndex } from '../actions';
import { getFlyoutTabsVisible, getFlyoutTabsIndex } from '../selectors';
import FlyoutTabs from './FlyoutTabs';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        flyoutTabsIndex: getFlyoutTabsIndex(state),
        visible: getFlyoutTabsVisible(state),
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        selectedArchiveIds: state.archive.selectedArchiveIds,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        hasMap: project && project.has_map === 1,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        countryKeys: state.archive.countryKeys,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setLocale: locale => dispatch(setLocale(locale)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FlyoutTabs));
