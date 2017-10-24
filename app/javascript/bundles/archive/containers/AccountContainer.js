import { connect } from 'react-redux';

import Account from '../components/Account';
import { submitLogout, fetchAccount } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        account: state.account
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: () => dispatch(submitLogout()),
    fetchAccount: () => dispatch(fetchAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
