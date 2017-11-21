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
      locale: state.archive.locale
  }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setQueryParams: (name, value) => dispatch(setQueryParams(name, value)),
    resetQuery: () => dispatch(resetQuery()),
    //loadFacets: () => dispatch(loadFacets()),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
