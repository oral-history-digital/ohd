import { connect } from 'react-redux';

import { changeRegistryEntriesViewMode } from 'modules/search';
import { getCurrentProject } from 'modules/data';
import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);

    return {
        projectId: state.archive.projectId,
        projects: state.data.projects,
        showRegistryEntriesTree: state.search.registryEntries.showRegistryEntriesTree,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    };
};

const mapDispatchToProps = (dispatch) => ({
    changeRegistryEntriesViewMode: bool => dispatch(changeRegistryEntriesViewMode(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTabPanel);
