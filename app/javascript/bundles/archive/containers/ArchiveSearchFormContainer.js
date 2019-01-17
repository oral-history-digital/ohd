import { connect } from 'react-redux';

import ArchiveSearchForm from '../components/ArchiveSearchForm';
import { 
    resetQuery, 
    setQueryParams, 
    //loadFacets, 
    searchInArchive 
} from '../actions/searchActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
  return {
      allInterviewsTitles: state.search.archive.allInterviewsTitles,
      allInterviewsPseudonyms: state.search.archive.allInterviewsPseudonyms,
      facets: state.search.archive.facets,
      query: state.search.archive.query,
      translations: state.archive.translations,
      locale: state.archive.locale,
      isArchiveSearching: state.search.isArchiveSearching,
      project: state.archive.project,
  }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    //loadFacets: () => dispatch(loadFacets()),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
