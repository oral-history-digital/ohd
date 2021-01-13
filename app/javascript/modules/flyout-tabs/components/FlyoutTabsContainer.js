import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getInterview, getInterviewee, getProject } from 'lib/utils';
import { openArchivePopup } from 'bundles/archive/actions/archivePopupActionCreators';
import { setLocale } from 'bundles/archive/actions/archiveActionCreators';
import { setFlyoutTabsIndex } from '../actions';
import { getFlyoutTabsVisible, getFlyoutTabsIndex } from '../selectors';
import FlyoutTabs from './FlyoutTabs';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        flyoutTabsIndex: getFlyoutTabsIndex(state),
        visible: getFlyoutTabsVisible(state),
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        selectedArchiveIds: state.archive.selectedArchiveIds,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        hasMap: project && project.has_map === 1,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
        interview: getInterview(state),
        interviewee: getInterviewee({interview: getInterview(state), people: state.data.people}),
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
