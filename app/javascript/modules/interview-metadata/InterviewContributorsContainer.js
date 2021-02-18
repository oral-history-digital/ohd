import { connect } from 'react-redux';

import { openArchivePopup } from 'modules/ui';
import { submitData, getCurrentInterview, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import InterviewContributors from './InterviewContributors';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    interview: getCurrentInterview(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterviewContributors);
