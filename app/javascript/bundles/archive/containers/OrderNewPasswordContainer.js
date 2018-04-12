import { connect } from 'react-redux';

import OrderNewPassword from '../components/OrderNewPassword';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        orderNewPasswordStatus: state.account.orderNewPasswordStatus,
        error: state.account.error
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderNewPassword);
