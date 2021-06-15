import { connect } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import { getInterviewSearch } from 'modules/search';
import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interviewSearchResults: getInterviewSearch(state),
    isInterviewSearching: state.search.isInterviewSearching,
});

export default connect(mapStateToProps)(InterviewSearch);
