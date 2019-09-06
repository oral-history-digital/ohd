import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { hideFlyoutTabs, showFlyoutTabs, toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchStaticContent } from '../actions/wrapperPageActionCreators';
import { setLocale, setProjectId } from '../actions/archiveActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        locale: state.archive.locale,
        translations: state.archive.translations,
        disabled: state.popup.show,
        visible: state.flyoutTabs.visible,
        loggedInAt: state.account.loggedInAt,
        projects: state.data.projects,
        projectsStatus: state.data.statuses.projects.all,
        project: getProject(state),
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
    toggleFlyoutTabs: (currentState) => { currentState ? dispatch(hideFlyoutTabs()) :  dispatch(showFlyoutTabs())}
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapperPage);
