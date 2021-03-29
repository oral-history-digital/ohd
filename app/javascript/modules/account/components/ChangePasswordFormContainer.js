import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects } from 'modules/data';
import { submitChangePassword } from '../actions';
import { getAccount } from '../selectors';
import ChangePasswordForm from './ChangePasswordForm';

const mapStateToProps = state => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getAccount(state),
    };
}

const mapDispatchToProps = (dispatch) => ({
    submitChangePassword: (url, method, params) => dispatch(submitChangePassword(url, method, params)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePasswordForm));
