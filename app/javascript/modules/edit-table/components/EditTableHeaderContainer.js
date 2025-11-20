import { connect } from 'react-redux';

import { getEditView } from 'modules/archive';
import {
    getCurrentInterview,
    getCurrentProject,
    getCurrentUser,
} from 'modules/data';
import { getSelectedColumns } from '../selectors';
import EditTableHeader from './EditTableHeader';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    user: getCurrentUser(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
    selectedColumns: getSelectedColumns(state),
});

export default connect(mapStateToProps)(EditTableHeader);
