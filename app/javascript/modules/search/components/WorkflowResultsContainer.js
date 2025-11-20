import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import WorkflowResults from './WorkflowResults';

const mapStateToProps = (state) => ({
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(WorkflowResults);
