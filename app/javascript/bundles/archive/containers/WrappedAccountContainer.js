import { connect } from 'react-redux';

import WrappedAccount from '../components/WrappedAccount';
//import { submitLogout, fetchAccount } from '../actions/accountActionCreators';
//import { changeToEditView } from '../actions/archiveActionCreators';
//import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.account,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    //submitLogout: () => dispatch(submitLogout()),
    //fetchAccount: () => dispatch(fetchAccount()),
    //changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    //hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
