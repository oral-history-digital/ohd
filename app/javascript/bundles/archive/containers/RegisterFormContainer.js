import { connect } from 'react-redux';

import RegisterForm from '../components/RegisterForm';
import { submitRegister } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitRegister: (params) => dispatch(submitRegister(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
