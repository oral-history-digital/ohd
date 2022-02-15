import { connect } from 'react-redux';

import { getLoginError, getOrderNewPasswordStatus } from '../selectors';
import OrderNewPassword from './OrderNewPassword';

const mapStateToProps = state => ({
    orderNewPasswordStatus: getOrderNewPasswordStatus(state),
    error: getLoginError(state),
});

export default connect(mapStateToProps)(OrderNewPassword);
