import { connect } from 'react-redux';

import InterviewEditView from '../components/InterviewEditView';
import { handleTranscriptScroll, setActualSegment } from '../actions/interviewActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getInterview(state),
        tape: state.interview.tape,
        transcriptTime: state.interview.transcriptTime,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        skipEmptyRows: state.archive.skipEmptyRows,
        segmentsStatus: state.data.statuses.segments,
        selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    setActualSegment: segment => dispatch(setActualSegment(segment)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditView);
