import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToInterviewEditView, getInterviewEditView } from 'modules/archive';
import { setSkipEmptyRows } from '../actions';
import { getSkipEmptyRows } from '../selectors';
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
