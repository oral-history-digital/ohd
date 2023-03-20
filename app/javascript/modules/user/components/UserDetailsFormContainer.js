import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { submitData } from 'modules/data';
import { getCurrentProject, getCurrentUser } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import UserDetailsForm from './UserDetailsForm';

const mapStateToProps = state => ({
    user: getCurrentUser(state),
    locale: getLocale(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsForm);
