import { connect } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import InterviewContributors from './InterviewContributors';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewContributors);