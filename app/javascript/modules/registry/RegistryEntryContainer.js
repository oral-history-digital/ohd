import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, deleteData, getRegistryEntries,
    getRegistryEntriesStatus, getCurrentAccount, getCurrentProject } from 'modules/data';
import { addRemoveRegistryEntryId, getLocale, getTranslations,
    getSelectedRegistryEntryIds, getProjectId, getEditView } from 'modules/archive';
import RegistryEntry from './RegistryEntry';

const mapStateToProps = (state) => ({
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    registryEntries: getRegistryEntries(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
    editView: getEditView(state),
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    addRemoveRegistryEntryId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
