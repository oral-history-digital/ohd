import { connect } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import { getInterviews } from 'modules/data';
import { getInterviewSearch } from 'modules/search';
import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interviews: getInterviews(state),
    interviewSearchResults: getInterviewSearch(state),
});

export default connect(mapStateToProps)(InterviewSearch);
