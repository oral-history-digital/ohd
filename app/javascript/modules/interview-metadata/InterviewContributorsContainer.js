import {
    getContributionsStatus,
    getCurrentInterview,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InterviewContributors from './InterviewContributors';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: getContributionsStatus(state).lastModified,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InterviewContributors);
