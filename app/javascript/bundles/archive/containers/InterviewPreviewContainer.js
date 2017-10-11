import { connect } from 'react-redux';

import InterviewPreview from '../components/InterviewPreview';
import * as actionCreators from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
  return {
      fulltext: state.archive.fulltext,
      locale: state.archive.locale
  }
}

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(InterviewPreview);
