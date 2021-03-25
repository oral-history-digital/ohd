import { connect } from 'react-redux';

import { getLocale, getProjectId, getLocales, getTranslations, getEditView } from 'modules/archive';
import { changeRegistryEntriesViewMode } from 'modules/search';
import { getCurrentProject } from 'modules/data';
import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);

    return {
        projectId: getProjectId(state),
        projects: state.data.projects,
        showRegistryEntriesTree: state.search.registryEntries.showRegistryEntriesTree,
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        account: state.data.accounts.current,
        editView: getEditView(state),
    };
};

const mapDispatchToProps = (dispatch) => ({
    changeRegistryEntriesViewMode: bool => dispatch(changeRegistryEntriesViewMode(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTabPanel);
