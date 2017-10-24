import { connect } from 'react-redux';

import RegisterForm from '../components/RegisterForm';
import { submitRegister } from '../actions/userContentActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitRregister: (params) => dispatch(submitRregister(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
