import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import { submitLogin } from '../actions';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogin: (url, params) => dispatch(submitLogin(url, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
