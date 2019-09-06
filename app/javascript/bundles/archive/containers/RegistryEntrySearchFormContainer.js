import { connect } from 'react-redux';

import RegistryEntrySearchForm from '../components/RegistryEntrySearchForm';
import { searchRegistryEntry } from '../actions/searchActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        query: state.search.registryEntries.query,
        translations: state.archive.translations,
        locale: state.archive.locale,
        isRegistryEntrySearching: state.search.isRegistryEntrySearching,
        projectId: project && project.initials,
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchRegistryEntry: (url, query) => dispatch(searchRegistryEntry(url, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySearchForm);
