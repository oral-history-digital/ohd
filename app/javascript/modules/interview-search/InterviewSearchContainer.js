import { connect } from 'react-redux';

import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: state.archive.archiveId,
    interviews: state.data.interviews,
    interviewSearchResults: state.search.interviews,
});

export default connect(mapStateToProps)(InterviewSearch);
