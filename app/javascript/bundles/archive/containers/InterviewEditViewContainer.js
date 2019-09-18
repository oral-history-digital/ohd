import { connect } from 'react-redux';

import InterviewEditView from '../components/InterviewEditView';
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
        segmentsStatus: state.data.statuses.segments,
        selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setActualSegment: segment => dispatch(setActualSegment(segment)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditView);
