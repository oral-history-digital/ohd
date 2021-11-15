import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import { clearSingleInterviewSearch, searchInInterview } from 'modules/search';
import InterviewSearchForm from './InterviewSearchForm';

const mapStateToProps = (state) => {
    let data = state.search.interviews[getArchiveId(state)];

    return {
        archiveId: getArchiveId(state),
        interviewFulltext: data && data.fulltext,
        isInterviewSearching: state.search.isInterviewSearching,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    clearSingleInterviewSearch,
    searchInInterview,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchForm);
