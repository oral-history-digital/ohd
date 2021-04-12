import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

const mapDispatchToProps = dispatch => bindActionCreators({
    searchRegistryEntry,
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistrySearchForm);
