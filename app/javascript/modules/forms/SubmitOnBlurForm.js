import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects } from 'modules/data';
import { getProjectId } from 'modules/archive';
import SubmitOnBlurFormComponent from './SubmitOnBlurFormComponent';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubmitOnBlurFormComponent);
