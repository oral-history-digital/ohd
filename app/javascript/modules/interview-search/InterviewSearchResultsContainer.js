import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId } from 'modules/archive';
import { setTapeAndTime, getCurrentTape, getTranscriptTime } from 'modules/media-player';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = (state) => ({
    archiveId: state.archive.archiveId,
    tape: getCurrentTape(state),
    transcriptTime: getTranscriptTime(state),
    locale: state.archive.locale,
    translations: state.archive.translations,
    isInterviewSearching: state.search.isInterviewSearching,
    fulltext: state.search.archive.query.fulltext,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInInterview,
    setTapeAndTime,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchResults);
