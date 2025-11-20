import { getEditView } from 'modules/archive';
import {
    getCurrentInterview,
    getCurrentProject,
    getCurrentUser,
    getSegmentsStatus,
} from 'modules/data';
import { connect } from 'react-redux';

import { getSelectedColumns } from '../selectors';
import EditTableRow from './EditTableRow';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    statuses: getSegmentsStatus(state),
    user: getCurrentUser(state),
    selectedColumns: getSelectedColumns(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(EditTableRow);
