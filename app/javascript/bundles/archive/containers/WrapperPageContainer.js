import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { showFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        externalLinks:  state.archive.externalLinks,
        archiveId: state.archive.archiveId,
        transcriptScrollEnabled: state.archive.transcriptScrollEnabled,
        locale: state.archive.locale,
        disabled: state.popup.show,
        visible: state.flyoutTabs.visible
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    showFlyoutTabs: () => dispatch(showFlyoutTabs()),
    toggleFlyoutTabs: (actualState) => { actualState ? dispatch(hideFlyoutTabs()) :  dispatch(showFlyoutTabs())}
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapperPage);
