import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { hideFlyoutTabs, showFlyoutTabs, toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchStaticContent } from '../actions/wrapperPageActionCreators';
import { setLocale } from '../actions/archiveActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        externalLinks:  state.archive.externalLinks,
        archiveId: state.archive.archiveId,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        locale: state.archive.locale,
        translations: state.archive.translations,
        disabled: state.popup.show,
        visible: state.flyoutTabs.visible,
        loggedInAt: state.account.loggedInAt,
        projectDomain: state.archive.projectDomain,
        project: state.archive.project,
        projectName: state.archive.projectName,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchStaticContent:() => dispatch(fetchStaticContent()),
    setLocale: locale => dispatch(setLocale(locale)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    showFlyoutTabs: () => dispatch(showFlyoutTabs()),
    toggleFlyoutTabs: (actualState) => { actualState ? dispatch(hideFlyoutTabs()) :  dispatch(showFlyoutTabs())}
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapperPage);
