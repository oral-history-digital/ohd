import { connect } from 'react-redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
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

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    addRemoveRegistryEntryId: (id) => dispatch(addRemoveRegistryEntryId(id)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
