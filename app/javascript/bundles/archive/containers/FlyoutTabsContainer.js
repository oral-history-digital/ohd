import { connect } from 'react-redux';

import FlyoutTabs from '../components/FlyoutTabs';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { setLocale } from '../actions/wrapperPageActionCreators';
import { fetchAccount } from '../actions/accountActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return {
        visible: state.flyoutTabs.visible,
        archiveId: state.archive.archiveId,
        interview: data && data.interview,
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.account,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setLocale: locale => dispatch(setLocale(locale)),
    fetchAccount: () => dispatch(fetchAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FlyoutTabs);
