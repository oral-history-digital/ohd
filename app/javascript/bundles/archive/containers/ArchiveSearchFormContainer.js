import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux'

import ArchiveSearchForm from '../components/ArchiveSearchForm';
import { resetSearchInArchive, searchInArchive } from '../actions/searchActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  return { 
    facets: state.archive.facets,
    searchQuery: state.archive.searchQuery,
    fulltext: state.archive.fulltext,
  }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    resetSearchInArchive: (query) => dispatch(resetSearchInArchive(query)),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
