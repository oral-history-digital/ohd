import { connect } from 'react-redux';

import { getEditView } from 'modules/archive';
import { getCurrentInterview, getCurrentProject, getCurrentAccount, getSegmentsStatus } from 'modules/data';
import { getSelectedColumns } from '../selectors';
import EditTableRow from './EditTableRow';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    statuses: getSegmentsStatus(state),
    account: getCurrentAccount(state),
    selectedColumns: getSelectedColumns(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(EditTableRow);
