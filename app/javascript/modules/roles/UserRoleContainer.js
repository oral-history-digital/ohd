import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProjectId } from 'modules/archive';
import { deleteData, getCurrentProject, getProjects } from 'modules/data';
import UserRole from './UserRole';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRole);
