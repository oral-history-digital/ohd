import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCountryKeys } from 'modules/archive';
import { getOHDProject } from 'modules/data';
import { submitRegister } from '../actions';
import { getRegistrationStatus } from '../selectors';
import RegisterForm from './RegisterForm';

const mapStateToProps = (state) => {
    return {
        ohd: getOHDProject(state),
        countryKeys: getCountryKeys(state),
        registrationStatus: getRegistrationStatus(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitRegister,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
