import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, getProjects, getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import { addRemoveRegistryEntryId, getLocale, getTranslations, getSelectedRegistryEntryIds,
    getProjectId } from 'modules/archive';
import RegistryEntry from './RegistryEntry';

const mapStateToProps = (state) => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    registryEntries: getRegistryEntries(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    addRemoveRegistryEntryId,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
