import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getIsLoggedIn } from 'modules/user';
import { setArchiveId, getInterviewEditView } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewFetched, getIsCatalog,
    fetchData } from 'modules/data';
import Interview from './Interview';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    interviewIsFetched: getCurrentInterviewFetched(state),
    isCatalog: getIsCatalog(state),
    interviewEditView: getInterviewEditView(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
