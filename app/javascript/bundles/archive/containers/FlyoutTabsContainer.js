import { connect } from 'react-redux';

import FlyoutTabs from '../components/FlyoutTabs';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { setLocale } from '../actions/archiveActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getFlyoutTabsVisible, getFlyoutTabsIndex } from '../selectors/flyoutTabsSelectors';
import { getInterview, getInterviewee, getCookie, getProject } from '../../../lib/utils';

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

export default connect(mapStateToProps, mapDispatchToProps)(FlyoutTabs);
