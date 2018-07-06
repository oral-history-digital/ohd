import { connect } from 'react-redux';

import Transcript from '../components/Transcript';
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
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    setActualSegment: segment => dispatch(setActualSegment(segment)),
    fetchData: (dataType, id, nestedDataType) => dispatch(fetchData(dataType, id, nestedDataType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
