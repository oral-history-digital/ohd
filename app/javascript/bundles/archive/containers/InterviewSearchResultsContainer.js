import { connect } from 'react-redux';
import InterviewSearchResults from '../components/InterviewSearchResults';
import { searchInInterview } from 'modules/search';
import { setArchiveId } from 'modules/archive';
import { setTapeAndTime, getCurrentTape, getTranscriptTime } from 'modules/interview';

const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        tape: getCurrentTape(state),
        transcriptTime: getTranscriptTime(state),
        locale: state.archive.locale,
        translations: state.archive.translations,
        isInterviewSearching: state.search.isInterviewSearching,
        fulltext: state.search.archive.query.fulltext,
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchResults);
