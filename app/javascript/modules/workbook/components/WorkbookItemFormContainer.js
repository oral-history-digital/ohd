import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview } from 'modules/data';
import { createWorkbook, updateWorkbook } from '../actions';
import WorkbookItemForm from './WorkbookItemForm';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    createWorkbook,
    updateWorkbook,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WorkbookItemForm);
