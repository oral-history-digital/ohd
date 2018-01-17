import { connect } from 'react-redux';

import ChangePasswordForm from '../components/ChangePasswordForm';
import { submitChangePassword } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitChangePassword: (params, resetToken) => dispatch(submitChangePassword(params, resetToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
