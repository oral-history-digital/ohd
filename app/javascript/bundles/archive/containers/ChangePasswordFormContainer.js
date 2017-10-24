import { connect } from 'react-redux';

import ChangePasswordForm from '../components/ChangePasswordForm';
import { submitChangePassword } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitChangePassword: (params) => dispatch(submitChangePassword(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
