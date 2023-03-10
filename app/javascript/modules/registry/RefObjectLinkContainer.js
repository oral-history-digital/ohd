import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getInterviews, getSegments, getCurrentProject, fetchData } from 'modules/data';
import { setArchiveId, getLocale, getProjectId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getIsLoggedIn } from 'modules/account';
import RefObjectLink from './RefObjectLink';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    interviews: getInterviews(state),
    segments: getSegments(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    setArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefObjectLink);

