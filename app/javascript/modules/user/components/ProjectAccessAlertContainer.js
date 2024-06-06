import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, getCurrentUser, getUsersStatus } from 'modules/data';
import ProjectAccessAlert from './ProjectAccessAlert';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    user: getCurrentUser(state),
});

export default connect(mapStateToProps)(ProjectAccessAlert);
