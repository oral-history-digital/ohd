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
      facets: state.search.facets,
      query: state.search.query,
      translations: state.archive.translations,
      locale: state.archive.locale
  }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setQueryParams: (params) => dispatch(setQueryParams(params)),
    resetQuery: () => dispatch(resetQuery()),
    //loadFacets: () => dispatch(loadFacets()),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
