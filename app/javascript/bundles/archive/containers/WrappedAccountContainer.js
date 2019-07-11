import { connect } from 'react-redux';

import WrappedAccount from '../components/WrappedAccount';
import { submitData } from '../actions/dataActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: getCookie('editView')
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params, locale) => dispatch(submitData(params, locale)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
