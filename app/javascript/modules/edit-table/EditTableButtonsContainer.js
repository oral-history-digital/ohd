import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToInterviewEditView, setSkipEmptyRows, getInterviewEditView, getSkipEmptyRows } from 'modules/archive';
import EditTableButtons from './EditTableButtons';

const mapStateToProps = (state) => ({
    editViewEnabled: !!getInterviewEditView(state),
    skipEmptyRows: getSkipEmptyRows(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    changeToInterviewEditView,
    setSkipEmptyRows,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditTableButtons);
