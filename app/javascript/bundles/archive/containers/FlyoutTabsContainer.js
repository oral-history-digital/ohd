import { connect } from 'react-redux';

import FlyoutTabs from '../components/FlyoutTabs';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { setLocale } from '../actions/wrapperPageActionCreators';


import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return {
        visible: state.flyoutTabs.visible,
        archiveId: state.archive.archiveId,
        interview: data && data.interview,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setLocale: locale => dispatch(setLocale(locale)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FlyoutTabs);
