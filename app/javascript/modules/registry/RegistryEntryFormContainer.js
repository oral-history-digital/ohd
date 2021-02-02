import { connect } from 'react-redux';

import RegistryEntryForm from './RegistryEntryForm';
import { submitData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        languages: state.data.languages,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryForm);
