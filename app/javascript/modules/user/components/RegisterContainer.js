import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getRegistrationStatus } from '../selectors';
import Register from './Register';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    registrationStatus: getRegistrationStatus(state),
});

export default connect(mapStateToProps)(Register);
