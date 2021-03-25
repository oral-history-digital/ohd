import { connect } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interviews: state.data.interviews,
    interviewSearchResults: state.search.interviews,
});

export default connect(mapStateToProps)(InterviewSearch);
