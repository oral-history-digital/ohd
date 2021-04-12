import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

const mapDispatchToProps = dispatch => bindActionCreators({
    submitLogin,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
