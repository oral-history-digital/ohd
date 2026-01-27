import { getCountryKeys } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitRegister } from '../actions';
import { getRegistrationStatus } from '../selectors';
import RegisterForm from './RegisterForm';

const mapStateToProps = (state) => {
    return {
        project: getCurrentProject(state),
        countryKeys: getCountryKeys(state),
        registrationStatus: getRegistrationStatus(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitRegister,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
