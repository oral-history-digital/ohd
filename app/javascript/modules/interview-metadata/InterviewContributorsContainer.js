import { connect } from 'react-redux';

import { openArchivePopup } from 'modules/ui';
import { submitData } from 'modules/data';
import { getInterview  } from 'lib/utils';
import InterviewContributors from './InterviewContributors';

const mapStateToProps = state => ({
    interview: getInterview(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterviewContributors);
