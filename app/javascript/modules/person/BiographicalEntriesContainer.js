import { getCurrentInterview, getCurrentIntervieweeId } from 'modules/data';
import { connect } from 'react-redux';

import BiographicalEntries from './BiographicalEntries';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
});

export default connect(mapStateToProps)(BiographicalEntries);
