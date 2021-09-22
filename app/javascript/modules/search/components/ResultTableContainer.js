import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getArchiveFoundInterviews, getArchiveQuery } from '../selectors';
import ResultTable from './ResultTable';

const mapStateToProps = state => ({
    foundInterviews: getArchiveFoundInterviews(state),
    query: getArchiveQuery(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(ResultTable);
