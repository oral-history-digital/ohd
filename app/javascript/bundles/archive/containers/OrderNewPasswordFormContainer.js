import { connect } from 'react-redux';

import OrderNewPasswordForm from '../components/OrderNewPasswordForm';
import { submitOrderNewPassword } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitOrderNewPassword: (params) => dispatch(submitOrderNewPassword(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderNewPasswordForm);
