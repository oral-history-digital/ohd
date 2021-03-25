import { connect } from 'react-redux';

import { getLocale, getProjectId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { submitLogin } from '../actions';
import LoginForm from './LoginForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogin: (url, params) => dispatch(submitLogin(url, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
