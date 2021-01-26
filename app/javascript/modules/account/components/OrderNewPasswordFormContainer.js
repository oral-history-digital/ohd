import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import OrderNewPasswordForm from './OrderNewPasswordForm';
import { submitOrderNewPassword } from '../actions';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitOrderNewPassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderNewPasswordForm);
