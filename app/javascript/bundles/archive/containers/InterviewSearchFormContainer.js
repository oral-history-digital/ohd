import {connect} from 'react-redux';

import InterviewSearchForm from '../components/InterviewSearchForm';
import * as actionCreators from '../actions/searchActionCreators';


// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    let data = state.search.interviews[state.archive.archiveId];
    return {
        archiveId: state.archive.archiveId,
        interviewFulltext: data && data.fulltext,
        translations: state.archive.translations,
        locale: state.archive.locale,
        isInterviewSearching: state.search.isInterviewSearching,
    }
}

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(InterviewSearchForm);
