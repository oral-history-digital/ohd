import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, deleteData, getProjects, getCurrentProject } from 'modules/data';
import { getArchiveId, getProjectId } from 'modules/archive';
import Contribution from './Contribution';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
