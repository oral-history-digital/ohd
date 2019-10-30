import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { hideFlyoutTabs, showFlyoutTabs, toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchStaticContent } from '../actions/wrapperPageActionCreators';
import { changeToEditView, setLocale, setProjectId } from '../actions/archiveActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        disabled: state.popup.show,
        visible: state.flyoutTabs.visible,
        loggedInAt: state.account.loggedInAt,
        collections: state.data.collections,
        collectionsStatus: state.data.statuses.collections,
        languages: state.data.languages,
        languagesStatus: state.data.statuses.languages,
        projects: state.data.projects,
        projectsStatus: state.data.statuses.projects,
        project: project,
        editViewCookie: getCookie('editView'),
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchStaticContent:(url) => dispatch(fetchStaticContent(url)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setLocale: locale => dispatch(setLocale(locale)),
    setProjectId: id => dispatch(setProjectId(id)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    showFlyoutTabs: () => dispatch(showFlyoutTabs()),
    toggleFlyoutTabs: (currentState) => { currentState ? dispatch(hideFlyoutTabs()) :  dispatch(showFlyoutTabs())},
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapperPage);
