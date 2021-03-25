import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getLoginError, getOrderNewPasswordStatus } from '../selectors';
import OrderNewPassword from './OrderNewPassword';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        translations: getTranslations(state),
        orderNewPasswordStatus: getOrderNewPasswordStatus(state),
        error: getLoginError(state),
    }
}

export default connect(mapStateToProps)(OrderNewPassword);
