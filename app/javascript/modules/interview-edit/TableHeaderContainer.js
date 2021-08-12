import { connect } from 'react-redux';

import { getSelectedInterviewEditViewColumns, getEditView } from 'modules/archive';
import { getCurrentInterview, getCurrentProject, getCurrentAccount } from 'modules/data';
import TableHeader from './TableHeader';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
    selectedInterviewEditViewColumns: getSelectedInterviewEditViewColumns(state),
});

export default connect(mapStateToProps)(TableHeader);
