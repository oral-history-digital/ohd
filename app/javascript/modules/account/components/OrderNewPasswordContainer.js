import { connect } from 'react-redux';
import { getLoginError, getOrderNewPasswordStatus } from '../selectors';

import OrderNewPassword from './OrderNewPassword';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        orderNewPasswordStatus: getOrderNewPasswordStatus(state),
        error: getLoginError(state),
    }
}

export default connect(mapStateToProps)(OrderNewPassword);
