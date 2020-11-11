import { connect } from 'react-redux';

import InterviewEditButtons from '../components/InterviewEditButtons';
import { changeToInterviewEditView, setSkipEmptyRows } from '../actions/archiveActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => ({
    editViewEnabled: !!state.archive.interviewEditView,
    skipEmptyRows: state.archive.skipEmptyRows,
    locale: state.archive.locale,
    translations: state.archive.translations,
});

const mapDispatchToProps = (dispatch) => ({
    changeToInterviewEditView: (bool) => dispatch(changeToInterviewEditView(bool)),
    setSkipEmptyRows: bool => dispatch(setSkipEmptyRows(bool)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditButtons);
