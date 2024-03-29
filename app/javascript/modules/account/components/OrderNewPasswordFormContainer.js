import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects, getCurrentAccount } from 'modules/data';
import { submitOrderNewPassword } from '../actions';
import OrderNewPasswordForm from './OrderNewPasswordForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitOrderNewPassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderNewPasswordForm);
