import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToInterviewEditView, setSkipEmptyRows } from 'modules/archive';
import InterviewEditButtons from './InterviewEditButtons';

const mapStateToProps = (state) => ({
    editViewEnabled: !!state.archive.interviewEditView,
    skipEmptyRows: state.archive.skipEmptyRows,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    changeToInterviewEditView,
    setSkipEmptyRows,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditButtons);
