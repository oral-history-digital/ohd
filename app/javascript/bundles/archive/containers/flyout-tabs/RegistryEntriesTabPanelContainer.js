import { connect } from 'react-redux';

import RegistryEntriesTabPanel from '../../components/flyout-tabs/RegistryEntriesTabPanel';
import { changeRegistryEntriesViewMode } from '../../actions/searchActionCreators';
import { getProject } from '../../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);

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
