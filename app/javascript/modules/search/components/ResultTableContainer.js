import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getArchiveFoundInterviews, getArchiveQuery } from '../selectors';
import ResultTable from './ResultTable';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        foundInterviews: getArchiveFoundInterviews(state),
        query: getArchiveQuery(state),
        project: project,
        listColumns: project && project.list_columns,
    }
}

export default connect(mapStateToProps)(ResultTable);
