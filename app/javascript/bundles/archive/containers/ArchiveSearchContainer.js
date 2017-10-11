import { connect } from 'react-redux';

import ArchiveSearch from '../components/ArchiveSearch';
//import * as actionCreators from '../actions/searchActionCreators';
import * as actionCreators from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
  return { 
    foundInterviews: state.archive.foundInterviews,
    foundSegmentsForInterviews: state.archive.foundSegmentsForInterviews,
      allInterviewsCount: state.archive.allInterviewsCount,
      resultPagesCount: state.archive.resultPagesCount,
      resultsCount: state.archive.resultsCount,
      searchQuery: state.archive.searchQuery,
    interviews: state.archive.interviews,
    isArchiveSearching: state.archive.isArchiveSearching
  }
}


export default connect(mapStateToProps, actionCreators)(ArchiveSearch);

