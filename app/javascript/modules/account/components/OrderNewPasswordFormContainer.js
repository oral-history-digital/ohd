import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { submitOrderNewPassword } from '../actions';
import OrderNewPasswordForm from './OrderNewPasswordForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        translations: getTranslations(state),
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitOrderNewPassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderNewPasswordForm);
