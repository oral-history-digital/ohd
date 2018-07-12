import { connect } from 'react-redux';

import FlyoutTabs from '../components/FlyoutTabs';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { setLocale } from '../actions/wrapperPageActionCreators';
import { fetchAccount } from '../actions/accountActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        visible: state.flyoutTabs.visible,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: state.archive.locales,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.account,
        interview: getInterview(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setLocale: locale => dispatch(setLocale(locale)),
    fetchAccount: () => dispatch(fetchAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FlyoutTabs);
