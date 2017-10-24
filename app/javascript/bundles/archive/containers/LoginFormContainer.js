import { connect } from 'react-redux';

import LoginForm from '../components/LoginForm';
import { submitLogin } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogin: (params) => dispatch(submitLogin(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
