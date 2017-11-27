import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { hideFlyoutTabs, showFlyoutTabs, toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchStaticContent, setLocale } from '../actions/wrapperPageActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        externalLinks:  state.archive.externalLinks,
        archiveId: state.archive.archiveId,
        transcriptScrollEnabled: state.archive.transcriptScrollEnabled,
        locale: state.archive.locale,
        translations: state.archive.translations,
        disabled: state.popup.show,
        visible: state.flyoutTabs.visible
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
