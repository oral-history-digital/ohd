import { connect } from 'react-redux';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import ArchiveSearch from '../components/ArchiveSearch';
import { searchInArchive } from '../actions/searchActionCreators';
import { fetchStaticContent } from '../actions/wrapperPageActionCreators';

const mapStateToProps = (state) => {
  return { 
    foundInterviews: state.search.foundInterviews,
      allInterviewsCount: state.search.allInterviewsCount,
      resultPagesCount: state.search.resultPagesCount,
      resultsCount: state.search.resultsCount,
      query: state.search.query,
    interviews: state.search.interviews,
    isArchiveSearching: state.search.isArchiveSearching
  }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
    fetchStaticContent:() => dispatch(fetchStaticContent()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);


