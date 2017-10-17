import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { setLocale } from '../actions/wrapperPageActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { showFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        transcriptScrollEnabled: state.archive.transcriptScrollEnabled,
        locales: state.archive.locales,
        locale: state.archive.locale,
        disabled: state.popup.show,
        visible: state.flyoutTabs.visible
    }
}

const mapDispatchToProps = (dispatch) => ({
    setLocale: locale => dispatch(setLocale(locale)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    showFlyoutTabs: () => dispatch(showFlyoutTabs()),
    toggleFlyoutTabs: (actualState) => { actualState ? dispatch(hideFlyoutTabs()) :  dispatch(showFlyoutTabs())}
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapperPage);
