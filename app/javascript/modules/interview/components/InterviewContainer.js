import { getInterviewEditView, setArchiveId } from 'modules/archive';
import {
    getCurrentInterview,
    getCurrentInterviewFetched,
    getIsCatalog,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Interview from './Interview';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    interviewIsFetched: getCurrentInterviewFetched(state),
    isCatalog: getIsCatalog(state),
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
