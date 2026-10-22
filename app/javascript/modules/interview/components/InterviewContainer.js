import { getInterviewEditView, setArchiveId } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewFetched } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Interview from './Interview';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    interviewIsFetched: getCurrentInterviewFetched(state),
    interviewEditView: getInterviewEditView(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setArchiveId,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
