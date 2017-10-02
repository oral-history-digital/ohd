import { connect } from 'react-redux';

import SearchForm from '../components/SearchForm';
import * as actionCreators from '../actions/searchActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  let data = ArchiveUtils.getInterview(state);
  return { 
    interview: data && data.interview,
  }
}

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(SearchForm);
