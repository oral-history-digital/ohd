import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChangePasswordForm from '../components/ChangePasswordForm';
import { submitChangePassword } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        account: state.account,
    };
}

const mapDispatchToProps = (dispatch) => ({
    submitChangePassword: (url, method, params) => dispatch(submitChangePassword(url, method, params)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePasswordForm));
