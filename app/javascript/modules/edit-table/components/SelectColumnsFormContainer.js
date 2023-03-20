import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getEditView } from 'modules/archive';
import { getCurrentInterview, getCurrentUser, getCurrentProject } from 'modules/data';
import { setColumns } from '../actions';
import { getSelectedColumns } from '../selectors';
import SelectColumnsForm from './SelectColumnsForm';

const mapStateToProps = state => ({
    selectedColumns: getSelectedColumns(state),
    interview: getCurrentInterview(state),
    user: getCurrentUser(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setColumns,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SelectColumnsForm);
