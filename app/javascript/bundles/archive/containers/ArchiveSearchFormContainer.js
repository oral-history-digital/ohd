import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux'

import ArchiveSearchForm from '../components/ArchiveSearchForm';
import * as actionCreators from '../actions/searchActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  return { 
    facets: state.archive.facets,
    searchQuery: state.archive.searchQuery,
    fulltext: state.archive.fulltext,
  }
}

//const mapDispatchToProps = (dispatch) => (
  //{ interviewActions: bindActionCreators(actionCreators, dispatch) }
//);

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(ArchiveSearchForm);
