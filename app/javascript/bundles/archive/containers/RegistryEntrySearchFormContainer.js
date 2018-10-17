import { connect } from 'react-redux';

import RegistryEntrySearchForm from '../components/RegistryEntrySearchForm';
import { searchRegistryEntry } from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
  return {
      query: state.search.registryEntries.query,
      translations: state.archive.translations,
      locale: state.archive.locale,
      isRegistryEntrySearching: state.search.isRegistryEntrySearching,
  }
}

const mapDispatchToProps = (dispatch) => ({
    searchRegistryEntry: (url, query) => dispatch(searchRegistryEntry(url, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySearchForm);
