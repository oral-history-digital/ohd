import { connect } from 'react-redux';

import { getLocale, getProjectId } from 'modules/archive';
import { submitLogin } from '../actions';
import LoginForm from './LoginForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogin: (url, params) => dispatch(submitLogin(url, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
