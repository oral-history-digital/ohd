import { connect } from 'react-redux';

import { searchRegistryEntry } from 'modules/search';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects } from 'modules/data';
import RegistrySearchForm from './RegistrySearchForm';

const mapStateToProps = (state) => {
    return {
        query: state.search.registryEntries.query,
        translations: getTranslations(state),
        locale: getLocale(state),
        isRegistryEntrySearching: state.search.isRegistryEntrySearching,
        projectId: getProjectId(state),
        projects: getProjects(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchRegistryEntry: (url, query) => dispatch(searchRegistryEntry(url, query)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrySearchForm);
