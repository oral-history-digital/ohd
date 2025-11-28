import { getCurrentProject } from 'modules/data';
import { connect } from 'react-redux';

import WorkflowResults from './WorkflowResults';

const mapStateToProps = (state) => ({
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(WorkflowResults);
