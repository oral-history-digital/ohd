import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getLocales, getTranslations, getEditView } from 'modules/archive';
import { changeRegistryEntriesViewMode } from 'modules/search';
import { getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);

    return {
        projectId: getProjectId(state),
        projects: getProjects(state),
        showRegistryEntriesTree: state.search.registryEntries.showRegistryEntriesTree,
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    changeRegistryEntriesViewMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTabPanel);
