import { connect } from 'react-redux';

import Account from '../components/Account';
import { submitLogout, fetchAccount } from '../actions/accountActionCreators';
import { changeToEditView } from '../actions/archiveActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: () => dispatch(submitLogout()),
    fetchAccount: () => dispatch(fetchAccount()),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
