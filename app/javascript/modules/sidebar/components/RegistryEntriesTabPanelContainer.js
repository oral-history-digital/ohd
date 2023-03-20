import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { changeRegistryEntriesViewMode, getShowRegistryEntriesSearchResults } from 'modules/search';
import { getProjectLocales, getProjects, getCurrentUser } from 'modules/data';
import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    showRegistryEntriesSearchResults: getShowRegistryEntriesSearchResults(state),
    locale: getLocale(state),
    locales: getProjectLocales(state),
    translations: getTranslations(state),
    user: getCurrentUser(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    changeRegistryEntriesViewMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTabPanel);
