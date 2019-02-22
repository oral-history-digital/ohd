import { connect } from 'react-redux';

import ChangePasswordForm from '../components/ChangePasswordForm';
import { submitChangePassword } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitChangePassword: (url, method, params) => dispatch(submitChangePassword(url, method, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
