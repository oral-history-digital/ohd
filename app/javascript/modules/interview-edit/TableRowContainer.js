import { connect } from 'react-redux';

import { getSelectedInterviewEditViewColumns, getEditView } from 'modules/archive';
import { getCurrentInterview, getCurrentProject, getCurrentAccount, getSegmentsStatus } from 'modules/data';
import TableRow from './TableRow';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    statuses: getSegmentsStatus(state),
    account: getCurrentAccount(state),
    selectedInterviewEditViewColumns: getSelectedInterviewEditViewColumns(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(TableRow);
