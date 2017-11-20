import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux'

import ArchiveSearchForm from '../components/ArchiveSearchForm';
import { 
    resetQuery, 
    setQueryParams, 
    loadFacets, 
    searchInArchive 
} from '../actions/searchActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  return { 
      facets: state.search.facets,
      query: state.search.query,
      //fulltext: state.search.fulltext,
      locale: state.search.locale
  }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setQueryParams: (name, value) => dispatch(setQueryParams(name, value)),
    resetQuery: () => dispatch(resetQuery()),
    loadFacets: () => dispatch(loadFacets()),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
