import { connect } from 'react-redux';

import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = (state) => ({
    isInterviewSearching: state.search.isInterviewSearching,
});

export default connect(mapStateToProps)(InterviewSearchResults);
