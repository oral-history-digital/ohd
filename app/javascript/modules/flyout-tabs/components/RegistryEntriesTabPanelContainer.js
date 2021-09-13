import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { changeRegistryEntriesViewMode } from 'modules/search';
import { getProjectLocales, getProjects, getCurrentAccount } from 'modules/data';
import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    showRegistryEntriesTree: state.search.registryEntries.showRegistryEntriesTree,
    locale: getLocale(state),
    locales: getProjectLocales(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    changeRegistryEntriesViewMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTabPanel);
