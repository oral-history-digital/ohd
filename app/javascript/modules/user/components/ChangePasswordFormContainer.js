import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { submitChangePassword } from '../actions';
import { getAccount } from '../selectors';
import ChangePasswordForm from './ChangePasswordForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    user: getAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitChangePassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
