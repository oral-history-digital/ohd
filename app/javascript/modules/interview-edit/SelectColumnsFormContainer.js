import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectInterviewEditViewColumns, getEditView, getSelectedInterviewEditViewColumns } from 'modules/archive';
import { getCurrentInterview, getCurrentAccount } from 'modules/data';
import SelectColumnsForm from './SelectColumnsForm';

const mapStateToProps = state => ({
    selectedInterviewEditViewColumns: getSelectedInterviewEditViewColumns(state),
    interview: getCurrentInterview(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    selectInterviewEditViewColumns,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SelectColumnsForm);
