import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLocale, getLocale, getArchiveId, getProjectId, getSelectedArchiveIds,
    getEditView, getTranslations, getCountryKeys } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewee, getCurrentProject, getProjects,
    getCurrentAccount, getProjectLocales } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import { setSidebarTabsIndex } from '../actions';
import { getSidebarVisible, getSidebarIndex } from '../selectors';
import SidebarTabs from './SidebarTabs';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        sidebarTabsIndex: getSidebarIndex(state),
        visible: getSidebarVisible(state),
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
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTabs);
