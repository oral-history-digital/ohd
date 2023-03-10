import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeRegistryEntriesViewMode, searchRegistryEntry } from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import RegistrySearchForm from './RegistrySearchForm';

const mapStateToProps = (state) => {
    return {
        query: state.search.registryEntries.query,
        translations: getTranslations(state),
        locale: getLocale(state),
        isRegistryEntrySearching: state.search.isRegistryEntrySearching,
        projectId: getProjectId(state),
        project: getCurrentProject(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    searchRegistryEntry,
    changeRegistryEntriesViewMode,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistrySearchForm);
