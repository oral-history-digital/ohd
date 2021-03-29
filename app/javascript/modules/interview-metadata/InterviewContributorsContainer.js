import { connect } from 'react-redux';

import { getCurrentInterview, submitData, getContributionsStatus } from 'modules/data';
import InterviewContributors from './InterviewContributors';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: getContributionsStatus(state).lastModified,
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params))
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewContributors);
