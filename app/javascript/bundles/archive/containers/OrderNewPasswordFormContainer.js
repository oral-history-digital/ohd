import { connect } from 'react-redux';

import OrderNewPasswordForm from '../components/OrderNewPasswordForm';
import { submitOrderNewPassword } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitOrderNewPassword: (url, params) => dispatch(submitOrderNewPassword(url, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderNewPasswordForm);
