import { connect } from 'react-redux';

import Transcript from '../components/Transcript';
import { 
    handleTranscriptScroll,
    fetchInterviewData
} from '../actions/interviewActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        tape: state.archive.tape,
        data: ArchiveUtils.getInterview(state),
        transcriptTime: state.archive.transcriptTime,
        transcriptScrollEnabled: state.archive.transcriptScrollEnabled
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchInterviewData: (archiveId, dataType) => dispatch(fetchInterviewData(archiveId, dataType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
