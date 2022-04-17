import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import ResultTable from './ResultTable';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(ResultTable);
