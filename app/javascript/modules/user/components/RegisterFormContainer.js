import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProjectId, getCountryKeys } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { submitRegister } from '../actions';
import RegisterForm from './RegisterForm';

const mapStateToProps = (state) => {
    return {
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        countryKeys: getCountryKeys(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitRegister,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
