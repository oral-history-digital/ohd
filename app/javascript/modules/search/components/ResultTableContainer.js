import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getArchiveQuery } from '../selectors';
import ResultTable from './ResultTable';

const mapStateToProps = state => ({
    query: getArchiveQuery(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(ResultTable);
