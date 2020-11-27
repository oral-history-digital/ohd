import { connect } from 'react-redux';

import InterviewContributors from '../components/InterviewContributors';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { submitData } from '../actions/dataActionCreators';
import { getInterview  } from 'lib/utils';

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
