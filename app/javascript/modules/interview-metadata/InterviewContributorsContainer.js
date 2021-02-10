import { connect } from 'react-redux';

import { openArchivePopup } from 'modules/ui';
import { submitData, getCurrentInterview } from 'modules/data';
import InterviewContributors from './InterviewContributors';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterviewContributors);
