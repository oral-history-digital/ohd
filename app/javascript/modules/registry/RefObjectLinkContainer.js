import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId } from 'modules/archive';
import { getInterviews, getSegments, fetchData } from 'modules/data';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getIsLoggedIn } from 'modules/user';
import RefObjectLink from './RefObjectLink';

const mapStateToProps = state => ({
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
