import { getCurrentUser } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitOrderNewPassword } from '../actions';
import OrderNewPasswordForm from './OrderNewPasswordForm';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitOrderNewPassword,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderNewPasswordForm);
