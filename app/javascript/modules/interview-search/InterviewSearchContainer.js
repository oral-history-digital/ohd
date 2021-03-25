import { connect } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import { getInterviews } from 'modules/data';
import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interviews: getInterviews(state),
    interviewSearchResults: state.search.interviews,
});

export default connect(mapStateToProps)(InterviewSearch);
