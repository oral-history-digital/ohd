import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getArchiveQuery } from '../selectors';
import WorkflowResults from './WorkflowResults';

const mapStateToProps = state => ({
    query: getArchiveQuery(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(WorkflowResults);
