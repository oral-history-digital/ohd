import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import WrapperPage from '../components/WrapperPage';
import { closeArchivePopup, getPopupShow } from 'modules/ui';
import { toggleFlyoutTabs } from 'modules/flyout-tabs';
import { fetchStaticContent } from '../actions/wrapperPageActionCreators';
import { setLocale, setProjectId } from '../actions/archiveActionCreators';
import { fetchData, deleteData } from '../actions/dataActionCreators';

import { getCookie, getProject } from 'lib/utils';
import { getFlyoutTabsVisible } from 'modules/flyout-tabs/selectors';
import { getTranscriptScrollEnabled } from 'modules/interview';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        project: project,
        projectsStatus: state.data.statuses.projects,
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        disabled: getPopupShow(state),
        visible: getFlyoutTabsVisible(state),
        loggedInAt: state.account.loggedInAt,
        collections: state.data.collections,
        collectionsStatus: state.data.statuses.collections,
        languages: state.data.languages,
        languagesStatus: state.data.statuses.languages,
        editViewCookie: getCookie('editView') === 'true',
        editView: state.archive.editView,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        isLoggedIn: state.account.isLoggedIn,
        isLoggedOut: state.account.isLoggedOut,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchStaticContent:(url) => dispatch(fetchStaticContent(url)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove, onlyRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove, onlyRemove)),
    setLocale: locale => dispatch(setLocale(locale)),
    setProjectId: id => dispatch(setProjectId(id)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    toggleFlyoutTabs: () => dispatch(toggleFlyoutTabs()),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(WrapperPage));
